"use client";

import React from 'react';
import { NameQualification } from '../components/NameQualification';
import { CertificateExperience } from '../components/CertificateExperience';
import { SolarDesignSection } from '../components/SolarDesignEngineerSection';
import { CheckCircle } from 'lucide-react';
import { AdditionalDetails } from '../components/AdditionalDetails';

export default function ProfilePage() {
  const handleSubmit = () => {
    alert("Profile Submitted Successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Step 1: Name and Qualifications */}
        <NameQualification />

        {/* Step 2: Certificates and Experience */}
        <CertificateExperience />

    
        <AdditionalDetails/>

  

      </div>
    </div>
  );
}