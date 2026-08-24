import React from 'react';

const CourseForm = () => {
    return (
        <div className="p-6  min-h-screen font-sans">
            {/* Page Title */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Add New Course</h1>
            </div>

            {/* Main Container: Two Columns */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Left Column (Main Editor & Meta Boxes) */}
                <div className="flex-1 space-y-6">

                    {/* Title Input */}
                    <div>
                        <input
                            type="text"
                            placeholder='Enter Course Title'
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>

                    {/* Editor Toolbar & Text Area */}
                    {/* here should be rich text editor import here tiptap here should be shown */}

                    {/* Accordion Panels (Excerpt, Custom Fields, etc.) */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm p-4 flex justify-between items-center text-gray-700 font-medium cursor-pointer">
                        <span>Instructor Details</span>
                        <span className="text-sm text-gray-400">▼</span>
                    </div>



                </div>

                {/* Right Column (Sidebar Widgets) */}
                <div className="w-full lg:w-80 space-y-6">

                    {/* Publish Box */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm">
                        <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50">
                            Publish
                        </div>
                        <div className="p-4 space-y-3 text-sm text-gray-600">
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 font-medium">Save Draft</button>
                                <button className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 font-medium">Preview</button>
                            </div>
                            <p>📍 Status: <span className="font-semibold text-gray-800">Draft</span> <a href="#edit" className="text-blue-600 hover:underline">Edit</a></p>
                            <p>👁️ Visibility: <span className="font-semibold text-gray-800">Public</span> <a href="#edit" className="text-blue-600 hover:underline">Edit</a></p>
                            <p>📅 Publish immediately <a href="#edit" className="text-blue-600 hover:underline">Edit</a></p>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-red-600 hover:underline text-sm cursor-pointer">Move to Trash</span>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded shadow">Publish</button>
                        </div>
                    </div>

                    {/* Course Categories Box */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm">
                        <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50">
                            Course Categories
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="text-sm border-b border-gray-200 pb-2 flex gap-4">
                                <span className="text-blue-600 border-b-2 border-blue-600 pb-2 -mb-2 font-medium cursor-pointer">All Categories</span>
                            </div>

                            {/* list of categories */}
                            <div className="space-y-2 max-h-40 overflow-y-auto text-sm text-gray-700">
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                                    <span>Web Development</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                    <span>Data Science</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                    <span>UI/UX Design</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                    <span>Business Strategy</span>
                                </label>
                            </div>
                            <button className="text-blue-600 hover:underline text-sm font-medium mt-2 block">+ Add New Category</button>
                        </div>
                    </div>

                    {/* Course Tags Box */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm">
                        <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-700 bg-gray-50">
                            Course Tags
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    defaultValue="React, Frontend, JavaScript"
                                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none"
                                    readOnly
                                />
                                <button className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-200">Add</button>
                            </div>
                            <p className="text-xs text-gray-500">Separate tags with commas</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default CourseForm;