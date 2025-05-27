"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [referralCode, setReferralCode] = useState<string>('');
  const [persona, setPersona] = useState<string>('');
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>('');

  const allowedReferralCodes = ["312486", "945201", "228409", "574193", "807612"];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'name' || name === 'email') {
      setUserInfo({ ...userInfo, [name]: value });
    } else if (name === 'referralCode') {
      setReferralCode(value);
    } else if (name === 'persona') {
      setPersona(value);
    } else {
      handleResponseChange(name, value);
    }
  };

  const handleResponseChange = (name: string, value: string) => {
    setResponses((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!userInfo.name || !userInfo.email || !referralCode || !persona) {
      setError("Please fill out all required fields.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userInfo.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!allowedReferralCodes.includes(referralCode)) {
      setError("Invalid referral code. Please enter a valid one.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = {
      name: userInfo.name,
      email: userInfo.email,
      referralCode,
      persona,
      responses,
    };

    setLoading(true);
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Server response:", result);

      if (!response.ok || result.status === "error") {
        throw new Error(result.message || "Submission failed");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error submitting form:", err);
      setError(errorMsg);
      alert("Submission error: " + errorMsg);
    } finally {
      setLoading(false);
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

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome to Mentra Feedback</h1>
      <p className="text-sm text-muted-foreground">Please complete the form to share your thoughts. This is still in development—your voice helps shape Mentra.</p>
      {error && <p className="text-red-500 text-sm">Error: {error}</p>}

      {!submitted && !confirming && (
        <>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Your Name *</span>
              <input type="text" name="name" required value={userInfo.name} onChange={handleInputChange} className="mt-1 block w-full border px-3 py-2 rounded" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Email *</span>
              <input type="email" name="email" required value={userInfo.email} onChange={handleInputChange} className="mt-1 block w-full border px-3 py-2 rounded" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Referral Code *</span>
              <input type="text" name="referralCode" required value={referralCode} onChange={handleInputChange} className="mt-1 block w-full border px-3 py-2 rounded" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Who are you? *</span>
              <select name="persona" required value={persona} onChange={handleInputChange} className="mt-1 block w-full border px-3 py-2 rounded">
                <option value="">Select...</option>
                <option value="Student (Elementary)">Student (Elementary)</option>
                <option value="Student (Middle/High)">Student (Middle/High)</option>
                <option value="Parent">Parent</option>
                <option value="Educator">Educator</option>
              </select>
              {disclaimer}
            </label>
          </div>

          {visibleQuestions.length > 0 && (
            <div className="space-y-6 pt-6">
              <h2 className="text-lg font-semibold">Your Reflections</h2>
              {visibleQuestions.map((q) => (
                <div key={`question-${q.name}`} className="space-y-1">
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
            <button disabled={loading} onClick={() => setConfirming(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
              {loading ? "Loading..." : "Review My Answers"}
            </button>
          </div>
        </>
      )}

      {confirming && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">📝 Review & Edit Your Answers</h2>
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
              <span className="text-sm font-medium">Persona</span>
              <select name="persona" value={persona} onChange={handleInputChange} className="mt-1 block w-full border px-3 py-2 rounded">
                <option value="">Select...</option>
                <option value="Student (Elementary)">Student (Elementary)</option>
                <option value="Student (Middle/High)">Student (Middle/High)</option>
                <option value="Parent">Parent</option>
                <option value="Educator">Educator</option>
              </select>
            </label>
            <hr className="my-4" />
            {visibleQuestions.map((q) => (
              <div key={`confirm-${q.name}`}>
                <label className="block text-sm font-medium mb-1">{q.label}</label>
                <textarea
                  name={q.name}
                  value={responses[q.name] || ''}
                  onChange={(e) => handleResponseChange(q.name, e.target.value)}
                  className="block w-full border px-3 py-2 rounded"
                  rows={2}
                />
              </div>
            ))}
          </div>
          <div className="pt-4">
            <button disabled={loading} onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button onClick={() => setConfirming(false)} className="ml-4 text-gray-700 underline">Back</button>
          </div>
        </div>
      )}

      {submitted && (
        <div className="pt-6">
          <h2 className="text-xl font-bold text-green-600">🎉 Thank you!</h2>
          <p className="text-gray-700">Your feedback has been submitted successfully.</p>
        </div>
      )}
    </div>
  );
}
