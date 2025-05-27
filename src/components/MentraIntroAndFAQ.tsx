import { useState, useEffect } from "react";

export default function MentraIntroAndFAQ({ persona }: { persona: string }) {
  const [introCollapsed, setIntroCollapsed] = useState(false);
  const [faqCollapsed, setFaqCollapsed] = useState(true);

  useEffect(() => {
    if (persona) {
      setIntroCollapsed(true);
      setFaqCollapsed(true);
    }
  }, [persona]);

  return (
    <div className="space-y-6">
      {/* Intro Section */}
      <div className="transition-all duration-300">
        {!introCollapsed ? (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md relative">
            <button
              onClick={() => setIntroCollapsed(true)}
              className="absolute top-2 right-2 text-sm text-blue-600 hover:underline"
            >
              Collapse
            </button>
            <div className="mb-4"></div>
<h2 className="text-lg font-semibold text-blue-800">Meet Mentra — Your Partner in Growth</h2>
            <p className="text-sm text-blue-700 mt-2">
              Mentra is a trusted space built for schools to support meaningful student growth. Whether you&rsquo;re a student building confidence, a teacher guiding learning, or a parent supporting progress, Mentra helps uncover what matters most &mdash; through reflection, resilience, and connection &mdash; all without pressure, judgment, or noise.</p>
            <p className="text-sm text-blue-700 mt-4">
              Mentra is designed to help students grow through controlled struggle, not shortcuts, supporting the kind of self-awareness and perseverance that comes from working through problems yourself while also preparing them to collaborate with AI responsibly in the world ahead.
            </p>
            <hr className="my-4 border-t border-blue-200" />
            <p className="text-sm text-blue-700 mt-2 font-medium">
            </p>
            <p className="text-sm text-blue-700 mt-2 font-medium">
              Built to empower. Designed to listen. Always in your corner.
            </p>
          </div>
        ) : (
          <div className="text-sm text-blue-700">
            <button
              onClick={() => setIntroCollapsed(false)}
              className="bg-blue-100 border border-blue-300 px-3 py-1 rounded hover:bg-blue-200 transition"
            >
              💡 What is Mentra?
            </button>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="transition-all duration-300">
        {!faqCollapsed ? (
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-md relative">
            <button
              onClick={() => setFaqCollapsed(true)}
              className="absolute top-2 right-2 text-sm text-gray-600 hover:underline"
            >
              Collapse
            </button>
            <div className="mb-4"></div>
<h2 className="text-lg font-semibold text-gray-800">❓ Frequently Asked Questions</h2>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-700">About This Survey</h3>
              <div className="mt-2 space-y-3 text-sm text-gray-800">
                <div>
                  <strong>Is this live yet?</strong>
                  <p>No — this is part of our development process. Your input helps shape Mentra before public release.</p>
                </div>
                <div>
                  <strong>Can I be anonymous?</strong>
                  <p>Not for this form — we ask for your name and email so we can follow up if needed. Your responses won’t be shared publicly.</p>
                </div>
                <div>
                  <strong>Where can I learn more?</strong>
                  <p>Once this phase is complete, we’ll send a follow-up email with updates, early previews, and ways to stay involved.</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-700">About Mentra</h3>
              <div className="mt-2 space-y-3 text-sm text-gray-800">
                <div>
                  <strong>Does Mentra replace teachers or parents?</strong>
                  <p>No. Mentra is a co-pilot &mdash; it supports teachers and parents by surfacing reflection and growth insights. It helps students build the confidence and awareness that comes from working through challenges themselves, while also preparing them to use AI responsibly as part of their future.</p>
                </div>
                <div>
                  <strong>What is journaling in Mentra?</strong>
                  <p>It’s a private space where students reflect on how they think, feel, and grow. Journals are tagged, scaffolded, and summarized for insight—not for surveillance.</p>
                </div>
                <div>
                  <strong>Can parents or teachers read student journals?</strong>
                  <p>Only if the student shares them. By default, everything is private. Mentra only shares patterns&mdash;not raw content.</p>
                </div>
                <div>
                  <strong>What does Mentra do with emotional data?</strong>
                  <p>Mentra uses emotional and learning signals to support student development &mdash; not replace it. It identifies patterns that help students grow through challenge and reflection, while also building fluency in responsible AI collaboration. Nothing is shared without consent.</p>
                </div>
                <div>
                  <strong>What does it mean that Mentra “graduates” with students?</strong>
                  <p>Students can export their learning history, reflection patterns, and prompts to use with future AI tools.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-700">
            <button
              onClick={() => setFaqCollapsed(false)}
              className="bg-white border border-gray-400 px-3 py-1 rounded text-gray-800 hover:bg-gray-100 transition-shadow hover:shadow-sm font-medium"
            >
              Show FAQ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}