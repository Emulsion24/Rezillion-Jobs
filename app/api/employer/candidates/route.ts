import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// --- Strict Types for JSONB Columns ---

interface ToolItem {
  name: string;
}

interface SectionItem {
  tools?: ToolItem[];
}

interface TechnicalSkillsData {
  roleId?: string;
  sections?: SectionItem[];
}

// Interface for Database Row Result
interface CandidateDbRow {
  id: number;
  email: string;
  user_name: string;
  profile_name: string | null;
  experiences: unknown; // Raw JSONB
  technical_skills: unknown; // Raw JSONB
}

// GET: Search Candidates
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || '';
    const roleId = searchParams.get('roleId');
    const location = searchParams.get('location'); 

    let query = `
      SELECT 
        u.id, 
        u.email,
        u.full_name as user_name,
        c.full_name as profile_name,
        c.experiences,
        c.technical_skills
      FROM users u
      JOIN candidates c ON u.id = c.user_id
      WHERE u.role = 'candidate'
    `;

    // Strictly typed params array
    const params: (string | number)[] = [];
    let paramIndex = 1;

    // 1. Text Search
    if (search) {
      query += ` AND (u.full_name ILIKE $${paramIndex} OR c.full_name ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // 2. Technical Role Filter (JSONB)
    if (roleId) {
      query += ` AND c.technical_skills->>'roleId' = $${paramIndex}`;
      params.push(roleId);
      paramIndex++;
    }

    // 3. Location Filter
    if (location) {
      query += ` AND c.experiences::text ILIKE $${paramIndex}`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    query += ` LIMIT 50`;

    const result = await db.query(query, params);

    // Map DB result using strict interfaces
    const formattedCandidates = (result.rows as CandidateDbRow[]).map((row: CandidateDbRow) => {
      
      // Safe Cast: Treat unknown JSONB as our defined interface
      const techSkills = (row.technical_skills as TechnicalSkillsData) || {};
      const experiencesArray = (row.experiences as unknown[]) || [];
      
      // Generate readable role label
      const rawRole = techSkills.roleId || 'General';
      const roleLabel = rawRole.charAt(0).toUpperCase() + rawRole.slice(1) + (rawRole.includes('technician') ? '' : ' Engineer');

      // Flatten skills from the nested section structure
      const skillsList: string[] = [];
      if (techSkills.sections && Array.isArray(techSkills.sections)) {
        techSkills.sections.forEach((sec) => {
          if (sec.tools && Array.isArray(sec.tools)) {
            sec.tools.forEach((t) => { 
              if(t.name) skillsList.push(t.name); 
            });
          }
        });
      }

      // Calculate Experience based on array length check
      const expCount = Array.isArray(experiencesArray) ? experiencesArray.length : 0;
      const experienceLabel = expCount > 0 ? `${expCount * 2} Years (Est.)` : "Fresher";

      return {
        id: row.id,
        name: row.profile_name || row.user_name || "Unknown Candidate",
        roleId: rawRole,
        roleLabel: roleLabel,
        location: location || "India",
        experience: experienceLabel,
        skills: skillsList.slice(0, 5),
        availability: "Immediate", 
        rate: "Negotiable", 
        email: row.email
      };
    });

    return NextResponse.json(formattedCandidates);

  } catch (error) {
    // Narrow error type safely
    const errorMessage = error instanceof Error ? error.message : "Unknown Error";
    console.error("Candidate Search Error:", errorMessage);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}