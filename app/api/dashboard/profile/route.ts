import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 1. Define Strict Types for the Request Body
interface ProfileRequestBody {
  userId: string;
  fullName?: string;
  qualifications?: unknown[];
  experiences?: unknown[];
  languages?: unknown[];
  certificates?: unknown[];
  experienceDetails?: unknown[]; // Matches frontend key
  hobbies?: string[];
  achievements?: string[];
  greenEnergyReason?: string;
  additionalInfo?: string;
  declarationName?: string;
}

// GET: Load COMPLETE Profile Data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const query = `
      SELECT 
        u.email,
        c.full_name,
        -- Basic Details
        c.qualifications,
        c.experiences,
        c.languages,
        -- Document Uploads
        c.certificates,
        c.experience_details,
        -- Additional Details
        c.hobbies,
        c.achievements,
        c.green_energy_reason,
        c.additional_info,
        c.declaration_name
      FROM users u
      LEFT JOIN candidates c ON u.id = c.user_id
      WHERE u.id = $1
    `;

    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const data = result.rows[0];

    return NextResponse.json({
      full_name: data.full_name || '',
      qualifications: data.qualifications || [],
      experiences: data.experiences || [],
      languages: data.languages || [],
      // Documents
      certificates: data.certificates || [],
      experience_details: data.experience_details || [], 
      // Additional
      hobbies: data.hobbies || [],
      achievements: data.achievements || [],
      green_energy_reason: data.green_energy_reason || '',
      additional_info: data.additional_info || '',
      declaration_name: data.declaration_name || ''
    });

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST: Save Profile Data (Handles Partial Updates)
export async function POST(request: Request) {
  try {
    // Cast body to our strict interface
    const body = (await request.json()) as ProfileRequestBody;
    
    const { 
      userId, 
      fullName, qualifications, experiences, languages,
      certificates, experienceDetails,
      hobbies, achievements, greenEnergyReason, additionalInfo, declarationName
    } = body;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Helper: Safely convert input to JSON string or null (Strictly Typed)
    const getJson = (val: unknown | undefined): string | null => 
      val ? JSON.stringify(val) : null;

    // Helper: Safely get string value or null (Strictly Typed)
    const getVal = (val: string | undefined): string | null => 
      val !== undefined ? val : null;

    const query = `
      INSERT INTO candidates (
        user_id, 
        full_name, qualifications, experiences, languages,
        certificates, experience_details,
        hobbies, achievements, green_energy_reason, additional_info, declaration_name
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        full_name = COALESCE(EXCLUDED.full_name, candidates.full_name),
        qualifications = COALESCE(EXCLUDED.qualifications, candidates.qualifications),
        experiences = COALESCE(EXCLUDED.experiences, candidates.experiences),
        languages = COALESCE(EXCLUDED.languages, candidates.languages),
        
        certificates = COALESCE(EXCLUDED.certificates, candidates.certificates),
        experience_details = COALESCE(EXCLUDED.experience_details, candidates.experience_details),
        
        hobbies = COALESCE(EXCLUDED.hobbies, candidates.hobbies),
        achievements = COALESCE(EXCLUDED.achievements, candidates.achievements),
        green_energy_reason = COALESCE(EXCLUDED.green_energy_reason, candidates.green_energy_reason),
        additional_info = COALESCE(EXCLUDED.additional_info, candidates.additional_info),
        declaration_name = COALESCE(EXCLUDED.declaration_name, candidates.declaration_name);
    `;

    await db.query(query, [
      userId,
      getVal(fullName), 
      getJson(qualifications), 
      getJson(experiences), 
      getJson(languages),
      getJson(certificates),
      getJson(experienceDetails),
      getJson(hobbies),
      getJson(achievements),
      getVal(greenEnergyReason),
      getVal(additionalInfo),
      getVal(declarationName)
    ]);

    if (fullName) {
      await db.query('UPDATE users SET full_name = $1 WHERE id = $2', [fullName, userId]);
    }

    return NextResponse.json({ success: true, message: "Profile saved successfully" });

  } catch (error) {
    console.error("Save Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}