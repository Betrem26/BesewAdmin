import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function HelpCenter() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  useEffect(() => {
    setSelectedCategory("all");
  }, []);

  // Admin-focused FAQs
  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "How do I add or remove a user?",
      answer:
        "Go to the Users page in the admin dashboard. Click 'Add User' to create a new user, or use the delete icon next to a user to remove them. You can also edit user roles and permissions from this page.",
      category: "users",
    },
    {
      id: 2,
      question: "How do I approve or reject job postings?",
      answer:
        "Navigate to the Jobs or Job Approvals section. Review the details of each job post and use the Approve or Reject buttons to manage them. Approved jobs will be visible to the public.",
      category: "jobs",
    },
    {
      id: 3,
      question: "How can I view and manage payments?",
      answer:
        "Go to the Payments page to see all payment requests and transactions. You can approve, reject, or view details for each payment. Export payment data as CSV for reporting.",
      category: "payments",
    },
    {
      id: 4,
      question: "How do I access analytics and reports?",
      answer:
        "Click on the Analytics or Reports section in the sidebar. Here you can view platform usage, job statistics, user activity, and export reports for further analysis.",
      category: "analytics",
    },
    {
      id: 5,
      question: "How do I reset a user's password?",
      answer:
        "On the Users page, find the user and click 'Reset Password'. The user will receive an email or SMS with instructions to set a new password.",
      category: "users",
    },
    {
      id: 6,
      question: "How do I handle fraud reports?",
      answer:
        "Go to the Fraud Management section. Review each report, investigate the details, and use the provided actions to mark as reviewed, block, or dismiss the report.",
      category: "fraud",
    },
    {
      id: 7,
      question: "How do I update site-wide settings?",
      answer:
        "Navigate to the Settings page in the admin dashboard. Here you can update platform configurations, notification preferences, and other global settings.",
      category: "settings",
    },
    {
      id: 8,
      question: "How do I contact technical support?",
      answer:
        "If you encounter a technical issue, use the 'Contact Support' button below or email the IT team directly. Provide as much detail as possible, including screenshots and error messages.",
      category: "support",
    },
    {
      id: 9,
      question: "How do I manage advertisements?",
      answer:
        "Go to the Ad Management section to add, edit, activate, or deactivate ads. Track ad performance with impressions and clicks analytics.",
      category: "ads",
    },
    {
      id: 10,
      question: "How do I restore accidentally deleted data?",
      answer:
        "Contact the IT or support team immediately. Provide details about what was deleted and when. Data recovery options depend on your backup policy.",
      category: "support",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/settings")}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Settings
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Help Center
        </h1>
        <p className="text-gray-600">
          Find answers to common admin questions and get support for managing
          your platform.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for admin help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Admin Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
              >
                <span className="font-medium text-gray-900">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    expandedFAQ === faq.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {expandedFAQ === faq.id && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.044-5.709-2.573M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or browse different categories.
            </p>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Still Need Help?
        </h2>
        <p className="text-gray-600 mb-4">
          Can't find what you're looking for? Contact the IT or support team for
          admin-specific issues.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Contact Admin Support
          </button>
          <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Submit Admin Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
