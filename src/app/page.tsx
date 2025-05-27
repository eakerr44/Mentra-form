"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChangeEvent } from "react";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [referralCode, setReferralCode] = useState<string>('');
  const [persona, setPersona] = useState<string>('');
  const [responses, setResponses] = useState<Record<string, string>>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'name' || name === 'email') {
      setUserInfo({ ...userInfo, [name]: value });
    } else if (name === 'referralCode') {
      setReferralCode(value);
    } else if (name === 'persona') {
      setPersona(value);
    } else {
      setResponses({ ...responses, [name]: value });
    }
  };

const handleSubmit = async () => {
  const formData = {
    name: userInfo.name,
    email: userInfo.email,
    referralCode,
    persona,
    responses,
  };

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwmZ0px1ELger-V5cNGHQkmqV-8RKqUaHzmoGa1Qf82YufKBLX_575ZKNK-31deDi_-VQ/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Submission failed");

    setSubmitted(true);
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};


  const allQuestions = () => {
    switch (persona) {
      case "Student (Elementary)":
        return [
          { name: "funOrFrustrating", label: "What makes learning fun or frustrating for you?", tip: "Think about a time when you really liked or didn’t like learning something. What made it that way?" },
          { name: "helpWhenTricky", label: "What helps you learn when something is tricky?", tip: "Tell us what makes tough things easier for you—like when reading or solving a problem gets hard." },
          { name: "problemSolved", label: "Tell us about a time you solved a problem. What helped?", tip: "Think about when you figured something out. Who or what helped you?" },
          { name: "outOfSchoolLearning", label: "What do you like learning about outside of school?", tip: "This could be a hobby, a game, a subject, or anything that makes you curious." },
          { name: "smartSomeone", label: "If a smart someone helped you learn, what should they be like?", tip: "Describe what kind of helper would make learning easier or more fun for you." }
        ];
      case "Student (Middle/High)":
        return [
          { name: "getStuck", label: "What usually causes you to get stuck when learning something new?", tip: "Share a moment when you struggled—was it confusion, boredom, or something else?" },
          { name: "aiFeedbackFeel", label: "What would make feedback from an AI feel helpful instead of annoying?", tip: "Describe what kind of support you’d trust from a digital helper." },
          { name: "failureGrowth", label: "Tell us about a time when failure helped you grow.", tip: "Think of a time you messed up, but learned something important." },
          { name: "trustAI", label: "What would make you trust an AI companion in school?", tip: "Consider what would help you feel safe and heard." },
          { name: "goalMotivation", label: "What’s a goal you care about and how do you stay motivated?", tip: "Share a dream or challenge you’re working on and what keeps you going." }
        ];
      case "Parent":
        return [
          { name: "schoolWish", label: "What’s something you wish schools knew about how your child learns?", tip: "Describe something personal or specific about how your child thrives or struggles." },
          { name: "aiConfidence", label: "What would give you confidence in how AI is used to support your child?", tip: "Mention what transparency, oversight, or control would matter to you." },
          { name: "loopWithChild", label: "How do you currently stay in the loop with your child’s learning or mood?", tip: "Think about what’s working or not in how you stay informed." },
          { name: "easierSupport", label: "What would make it easier to support your child’s learning journey?", tip: "Imagine what tools or communication might reduce stress or improve involvement." },
          { name: "aiHopes", label: "What are your biggest hopes (or worries) about AI in education?", tip: "Share your dreams—or concerns—for the future of learning." }
        ];
      case "Educator":
        return [
          { name: "studentNeeds", label: "What are the hardest parts of understanding your students’ needs today?", tip: "Reflect on what data or behaviors are hard to interpret or catch in time." },
          { name: "aiSupportTool", label: "What would make AI a supportive tool instead of a burden?", tip: "Think about how AI could ease your workload or enhance learning—not complicate it." },
          { name: "emotionPrivacy", label: "How would you like to stay informed about student emotion or motivation without breaching privacy?", tip: "What would respectful, useful insight look like to you?" },
          { name: "alignWithStakeholders", label: "What would help you align with parents and students using AI tools like Mentra?", tip: "Share ideas for collaboration or clear communication." },
          { name: "teachingFeature", label: "What’s a feature that could truly improve your teaching experience?", tip: "Describe a pain point and what would solve it." }
        ];
      default:
        return [];
    }
  };

  const visibleQuestions = allQuestions();

  const disclaimer = persona === "Student (Elementary)" ? (
    <p className="text-xs text-red-600 mt-2">
      📌 If you are a student in elementary school, please complete this form with the help of a parent or teacher.
    </p>
  ) : null;

  if (confirming) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">📝 Review & Edit Your Answers</h1>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Name</span>
            <input type="text" name="name" value={userInfo.name} onChange={handleInputChange} className="mt-1 block w-full border px-3 py-2 rounded" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input type="email" name="email" value={userInfo.email} onChange={handleInputChange} className="mt-1 block w-full border px-3 py-2 rounded" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Referral Code</span>
            <input type="text" name="referralCode" value={referralCode} onChange={handleInputChange} className="mt-1 block w-full border px-3 py-2 rounded" />
          </label>
        </div>

        <div className="mt-6 space-y-6">
          {visibleQuestions.map((q) => (
            <label key={q.name} className="block">
              <span className="text-sm font-medium">{q.label}</span>
              <textarea
                name={q.name}
                value={responses[q.name] || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full border px-3 py-2 rounded"
                rows={2}
              />
            </label>
          ))}
        </div>

        <div className="pt-6">
          <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">Submit</button>
          <button onClick={() => setConfirming(false)} className="ml-4 text-gray-700 underline">Back</button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-green-600">🎉 Thank you for your feedback!</h1>
        <p className="text-gray-700">Your answers have been recorded. We'll send you more info soon.</p>
        <hr className="my-4" />
        <p className="text-sm text-muted-foreground">If you have any questions, just reply to the email we send. We're building Mentra together—thank you for your voice. ❤️</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome to Mentra Feedback</h1>
      <p className="text-sm text-muted-foreground">Please complete the form to share your thoughts. This is still in development—your voice helps shape Mentra.</p>
      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Your Name</span>
          <input type="text" name="name" value={userInfo.name} onChange={handleInputChange} className="mt-1 block w-full border px-3 py-2 rounded" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Email</span>
          <input type="email" name="email" value={userInfo.email} onChange={handleInputChange} className="mt-1 block w-full border px-3 py-2 rounded" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Referral Code</span>
          <input type="text" name="referralCode" value={referralCode} onChange={handleInputChange} className="mt-1 block w-full border px-3 py-2 rounded" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Who are you?</span>
          <select name="persona" value={persona} onChange={handleInputChange} className="mt-1 block w-full border px-3 py-2 rounded">
            <option value="">Select...</option>
            <option value="Student (Elementary)">Student (Elementary)</option>
            <option value="Student (Middle/High)">Student (Middle/High)</option>
            <option value="Parent">Parent</option>
            <option value="Educator">Educator</option>
          </select>
          {disclaimer}
        </label>
      </div>

      <hr className="my-6" />

      {visibleQuestions.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">Your Reflections</h2>
          {visibleQuestions.map((q) => (
            <div key={q.name} className="space-y-1">
              <label className="block">
                <span className="text-sm font-medium">{q.label}</span>
                <p className="text-xs text-gray-500 mb-1">{q.tip}</p>
                <textarea
                  name={q.name}
                  value={responses[q.name] || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border px-3 py-2 rounded"
                  rows={2}
                />
              </label>
            </div>
          ))}
        </div>
      )}

      <div className="pt-4">
        <button onClick={() => setConfirming(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Review My Answers</button>
      </div>
    </div>
  );
}
