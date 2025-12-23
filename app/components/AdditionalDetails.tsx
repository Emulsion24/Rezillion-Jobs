"use client";

import React, { useState } from 'react';
import { Lightbulb, Info, User, CheckCircle2, Plus, Trash2, Heart, Trophy } from 'lucide-react';

export const AdditionalDetails = () => {
  const [hobbies, setHobbies] = useState<string[]>([""]);
  // New state for multiple achievements
  const [achievements, setAchievements] = useState<string[]>([""]);

  // Hobby Logic
  const addHobby = () => setHobbies([...hobbies, ""]);
  const updateHobby = (index: number, value: string) => {
    const newHobbies = [...hobbies];
    newHobbies[index] = value;
    setHobbies(newHobbies);
  };
  const removeHobby = (index: number) => setHobbies(hobbies.filter((_, i) => i !== index));

  // Achievement Logic
  const addAchievement = () => setAchievements([...achievements, ""]);
  const updateAchievement = (index: number, value: string) => {
    const newArr = [...achievements];
    newArr[index] = value;
    setAchievements(newArr);
  };
  const removeAchievement = (index: number) => setAchievements(achievements.filter((_, i) => i !== index));

  return (
    <section className="bg-white text-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-8 bg-blue-50 w-fit px-4 py-1 rounded-md border border-blue-100">
        <span className="text-blue-600 font-black">5.</span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-blue-800">Final Details & Declaration</h3>
      </div>

      <div className="space-y-12">
        
        {/* 1. Hobbies Row Logic */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3">
            <Heart size={18} className="text-blue-500" />
            <h4 className="text-sm font-black uppercase text-slate-800 tracking-tight">Hobbies</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hobbies.map((hobby, idx) => (
              <div key={idx} className="flex items-center gap-2 group">
                <input 
                  type="text" 
                  value={hobby}
                  onChange={(e) => updateHobby(idx, e.target.value)}
                  placeholder="e.g. Photography, Trekking" 
                  className="flex-1 bg-slate-50 border border-slate-300 p-3 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {hobbies.length > 1 && (
                  <button 
                    onClick={() => removeHobby(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button 
            onClick={addHobby}
            className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline mt-2"
          >
            <Plus size={16} className="bg-blue-100 rounded-full" /> Add another hobby
          </button>
        </div>

        {/* 2. Achievements Row Logic (Updated) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-l-4 border-blue-500 pl-3">
            <Trophy size={18} className="text-blue-500" />
            <h4 className="text-sm font-black uppercase text-slate-800 tracking-tight">Key Achievements & Awards</h4>
          </div>
          
          <div className="space-y-3">
            {achievements.map((ach, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Lightbulb size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
                  <input 
                    type="text" 
                    value={ach}
                    onChange={(e) => updateAchievement(idx, e.target.value)}
                    placeholder="e.g. Won Best Innovator Award 2023..." 
                    className="w-full bg-slate-50 border border-slate-300 p-3 pl-11 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                {achievements.length > 1 && (
                  <button 
                    onClick={() => removeAchievement(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button 
            onClick={addAchievement}
            className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline mt-2"
          >
            <Plus size={16} className="bg-blue-100 rounded-full" /> Add another achievement
          </button>
        </div>

        {/* 3. Text Questions */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-700 uppercase flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">Q1</span>
              Why do you want to work in the Green Energy Sector?
            </label>
            <textarea 
              placeholder="Your answer here..." 
              className="w-full bg-slate-50 border border-slate-300 p-4 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 min-h-[80px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-700 uppercase flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">Q2</span>
              Anything else you would like us to know?
            </label>
            <div className="relative">
              <Info size={18} className="absolute left-4 top-4 text-blue-500" />
              <textarea 
                placeholder="Additional information..." 
                className="w-full bg-slate-50 border border-slate-300 p-4 pl-12 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 min-h-[80px]"
              />
            </div>
          </div>
        </div>

        {/* 4. Declaration & Signature */}
        <div className="pt-8 border-t border-slate-200 mt-10">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <p className="text-xs leading-relaxed text-slate-600 font-medium italic">
                <span className="font-black text-blue-800 not-italic uppercase tracking-tighter mr-2">Declaration:</span> 
                I hereby declare that the above-mentioned information is correct up to my knowledge and I bear the responsibility for the correctness of the above-mentioned particulars.
              </p>
              <div className="max-w-xs relative">
                <User size={16} className="absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Full Name (Signature)" 
                  className="w-full bg-white border border-slate-300 p-2.5 pl-10 rounded-lg text-sm font-black text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-black text-lg tracking-wide transition-all shadow-lg shadow-blue-200 active:scale-95">
              SUBMIT PROFILE <CheckCircle2 size={24} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};