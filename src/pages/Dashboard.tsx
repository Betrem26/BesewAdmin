"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../common/Sidebar";
import { FiSearch, FiMenu } from "react-icons/fi";
import { FaPlus, FaChevronDown, FaTimes } from "react-icons/fa";

// Define the Tab interface directly in this file
interface Tab {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

// Import your existing Chart components
import Chart1 from "../components/Chart1";
import Chart2 from "../components/Chart2";
import Chart3 from "../components/Chart3";

// Simplified Tab Content Component (without the widget section)
const TabContent = ({ tab }: { tab: Tab }) => {
  const getTabContent = () => {
    switch (tab.name.toLowerCase()) {
      case "sales dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Sales
                </h3>
                <p className="text-2xl font-bold text-gray-900">$124,500</p>
                <p className="text-sm text-green-600">+12% from last month</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">New Leads</h3>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
                <p className="text-sm text-green-600">+8% from last month</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">
                  Conversion Rate
                </h3>
                <p className="text-2xl font-bold text-gray-900">24.5%</p>
                <p className="text-sm text-red-600">-2% from last month</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">
                  Active Deals
                </h3>
                <p className="text-2xl font-bold text-gray-900">89</p>
                <p className="text-sm text-green-600">+15% from last month</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Chart1 />
              <Chart2 />
            </div>
          </div>
        );

      case "analytics dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">
                  Page Views
                </h3>
                <p className="text-2xl font-bold text-gray-900">45,678</p>
                <p className="text-sm text-green-600">+18% from last week</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">
                  Unique Visitors
                </h3>
                <p className="text-2xl font-bold text-gray-900">12,345</p>
                <p className="text-sm text-green-600">+5% from last week</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">
                  Bounce Rate
                </h3>
                <p className="text-2xl font-bold text-gray-900">32.1%</p>
                <p className="text-sm text-red-600">+3% from last week</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Chart1 />
              <Chart2 />
              <Chart3 />
            </div>
          </div>
        );

      default:
        // Just show the tab info without the widget grid
        return (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Custom Dashboard: {tab.name}
            </h3>
            <p className="text-gray-500">
              This tab is ready for your custom content.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{tab.name}</h2>
        <p className="text-gray-600 mb-4">{tab.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Created: {tab.createdAt.toLocaleDateString()}</span>
          <span>•</span>
          <span>Tab ID: {tab.id}</span>
        </div>
      </div>
      {getTabContent()}
    </div>
  );
};

const Dashboard = () => {
  const [isTyping, setIsTyping] = useState(false);
  console.log(isTyping);
  const [openSidebar, setOpenSidebar] = useState(true);
  const [showAddTab, setShowAddTab] = useState(false);
  const [tabName, setTabName] = useState("");
  const [tabDescription, setTabDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Tab management state
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      name: "Main Dashboard",
      description:
        "Primary dashboard with HR analytics and job matching reports",
      isActive: true,
      createdAt: new Date(),
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("1");

  // Load tabs from localStorage on component mount
  useEffect(() => {
    const savedTabs = localStorage.getItem("dashboard-tabs");
    if (savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs).map((tab: any) => ({
          ...tab,
          createdAt: new Date(tab.createdAt),
        }));
        setTabs(parsedTabs);

        // Set active tab
        const activeTab = parsedTabs.find((tab: Tab) => tab.isActive);
        if (activeTab) {
          setActiveTabId(activeTab.id);
        }
      } catch (error) {
        console.error("Error loading tabs from localStorage:", error);
      }
    }
  }, []);

  // Save tabs to localStorage whenever tabs change
  useEffect(() => {
    localStorage.setItem("dashboard-tabs", JSON.stringify(tabs));
  }, [tabs]);

  const handleAddTab = () => {
    if (tabName.trim()) {
      const newTab: Tab = {
        id: Date.now().toString(),
        name: tabName.trim(),
        description:
          tabDescription.trim() || `Custom dashboard: ${tabName.trim()}`,
        isActive: false,
        createdAt: new Date(),
      };

      // Add new tab to the list
      setTabs((prev) => [...prev, newTab]);

      // Switch to the new tab
      handleTabClick(newTab.id);

      // Reset form and close modal
      setTabName("");
      setTabDescription("");
      setShowAddTab(false);
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    setTabs((prev) =>
      prev.map((tab) => ({
        ...tab,
        isActive: tab.id === tabId,
      }))
    );
  };

  const handleDeleteTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (tabs.length > 1) {
      setTabs((prev) => prev.filter((tab) => tab.id !== tabId));

      // If deleting active tab, switch to first remaining tab
      if (activeTabId === tabId) {
        const remainingTabs = tabs.filter((tab) => tab.id !== tabId);
        if (remainingTabs.length > 0) {
          handleTabClick(remainingTabs[0].id);
        }
      }
    }
  };

  const handleCancel = () => {
    setTabName("");
    setTabDescription("");
    setShowAddTab(false);
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className="flex w-full h-screen bg-gray-50">
      {/* Sidebar */}
      {openSidebar && (
        <div className={`${openSidebar ? "block" : "hidden"} lg:block`}>
          <Sidebar closeSidebar={setOpenSidebar} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col w-full overflow-hidden">
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center space-x-1 overflow-x-auto">
              {!openSidebar && (
                <button
                  onClick={() => setOpenSidebar(true)}
                  className="p-2 text-gray-500 hover:text-gray-700 lg:hidden mr-2"
                >
                  <FiMenu className="w-5 h-5" />
                </button>
              )}

              {tabs.map((tab) => (
                <div key={tab.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => handleTabClick(tab.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200 flex items-center gap-2 ${
                      tab.isActive
                        ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="truncate max-w-32">{tab.name}</span>
                    {tabs.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteTab(tab.id, e)}
                        className="ml-1 p-1 text-gray-400 hover:text-red-500 transition-colors rounded"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAddTab(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FaPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Tab</span>
            </button>
          </div>
        </div>

        {/* Header Controls */}
        <div className="bg-white border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsTyping(e.target.value.length > 0);
                }}
                className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search jobs, candidates..."
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            {/* Date Input */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <input
                type="date"
                className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* User Menu - Changed name to Biruk */}
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">B</span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                  Biruk
                </span>
              </div>
              <FaChevronDown className="text-gray-400 cursor-pointer w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-5">
            {activeTab ? (
              <TabContent tab={activeTab} />
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No active tab selected</p>
              </div>
            )}

            {/* Default Charts Section (shown for Main Dashboard) */}
            {activeTab?.name === "Main Dashboard" && (
              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-700 text-center">
                      Matching Report
                    </h3>
                    <Chart1 />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-700 text-center">
                      Job Analysis
                    </h3>
                    <Chart2 />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-700 text-center">
                      Candidate Education Analysis
                    </h3>
                    <Chart3 />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add New Tab Modal - All functionality preserved */}
      {showAddTab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Add New Tab
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tab Name *
                  </label>
                  <input
                    type="text"
                    value={tabName}
                    onChange={(e) => setTabName(e.target.value)}
                    placeholder="e.g., Sales Dashboard, Analytics"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {tabName.length}/50 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={tabDescription}
                    onChange={(e) => setTabDescription(e.target.value)}
                    placeholder="Brief description of this dashboard tab"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {tabDescription.length}/200 characters
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTab}
                  disabled={!tabName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add Tab
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
