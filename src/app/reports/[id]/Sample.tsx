/** @format */

// /** @format */

// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Report, ReportActivity, ReportStatus } from "@/types/api";
// import {
//   useReportActivities,
//   useReportById,
// } from "@/hooks/reports/useReportDetails";
// import {
//   useResolveReport,
//   useUpvoteReport,
// } from "@/hooks/reports/useReportMutations";
// import TimelineItem from "./TimelineItem";
// import CommentBox from "./CommentBox";
// import Map from "@/components/Map";
// import { Button } from "@/components/ui/button";

// interface ReportIssueLayoutProps {
//   initialReport: Report;
//   initialActivities: ReportActivity[];
//   reportId: string;
// }

// const getStatusBadge = (status: ReportStatus) => {
//   const baseClasses = "px-3 py-1 rounded-full text-sm font-medium border";
//   switch (status) {
//     case ReportStatus.PENDING:
//       return `${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`;
//     case ReportStatus.IN_PROGRESS:
//       return `${baseClasses} bg-blue-100 text-blue-800 border-blue-200`;
//     case ReportStatus.RESOLVED:
//       return `${baseClasses} bg-purple-100 text-purple-800 border-purple-200`; // GitHub merged/closed style
//     case ReportStatus.ARCHIVED:
//       return `${baseClasses} bg-gray-100 text-gray-600 border-gray-300`;
//     default:
//       return `${baseClasses} bg-gray-100 text-gray-800 border-gray-200`;
//   }
// };

// const ReportIssueLayout: React.FC<ReportIssueLayoutProps> = ({
//   initialReport,
//   initialActivities,
//   reportId,
// }) => {
//   const { data: report } = useReportById(reportId);
//   const { data: activities } = useReportActivities(reportId);

//   const resolveMutation = useResolveReport();
//   const upvoteMutation = useUpvoteReport();

//   const currentReport = report || initialReport;
//   const currentActivities = activities || initialActivities;

//   const handleResolve = () => {
//     if (confirm("Are you sure you want to mark this report as resolved?")) {
//       resolveMutation.mutate(reportId);
//     }
//   };

//   const handleUpvote = () => {
//     if (
//       currentReport.status === ReportStatus.RESOLVED ||
//       currentReport.hasLiked
//     )
//       return;
//     upvoteMutation.mutate(reportId);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header Section */}
//       <div className="mb-8 border-b border-gray-200 pb-8">
//         <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
//           <div className="flex-1">
//             <div className="flex items-center gap-3 mb-2">
//               <h1 className="text-3xl font-bold text-gray-900">
//                 {currentReport.title}
//               </h1>
//             </div>
//             <div className="flex items-center flex-wrap gap-3 text-sm text-gray-600">
//               <span className={getStatusBadge(currentReport.status)}>
//                 {currentReport.status === ReportStatus.RESOLVED ? (
//                   <span className="flex items-center gap-1">
//                     <svg
//                       className="w-4 h-4"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     Resolved
//                   </span>
//                 ) : (
//                   <span className="flex items-center gap-1">
//                     <svg
//                       className="w-4 h-4"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     {currentReport.status.replace("_", " ")}
//                   </span>
//                 )}
//               </span>
//               <span className="font-medium text-gray-900">
//                 {currentReport.creator?.fullName || "Someone"}
//               </span>
//               <span>
//                 opened this issue on{" "}
//                 {new Date(currentReport.createdAt).toLocaleDateString()}
//               </span>
//               <span>· {currentActivities.length} activities</span>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             {currentReport.status === ReportStatus.ARCHIVED ? (
//               <Link href={`/reports/${currentReport.originalReportId}`}>
//                 <Button variant="outline">
//                   Merged with #
//                   {currentReport?.originalReportId?.split("-")[1] ||
//                     currentReport.originalReportId}
//                 </Button>
//               </Link>
//             ) : (
//               <Button
//                 variant={currentReport.hasLiked ? "default" : "outline"}
//                 onClick={handleUpvote}
//                 disabled={
//                   currentReport.status === ReportStatus.RESOLVED ||
//                   currentReport.hasLiked
//                 }
//                 className={`flex items-center gap-2 transition-colors ${
//                   currentReport.hasLiked
//                     ? ""
//                     : "border-gray-300 hover:bg-gray-50 text-gray-700"
//                 }`}
//               >
//                 <svg
//                   className={`w-4 h-4 ${
//                     currentReport.hasLiked ? "text-white" : "text-gray-500"
//                   }`}
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
//                 </svg>
//                 {currentReport.hasLiked ? "Upvoted" : "Upvote"}
//                 <span
//                   className={`ml-1 py-0.5 px-2 rounded-full text-xs font-semibold ${
//                     currentReport.hasLiked
//                       ? "bg-white/20 text-white"
//                       : "bg-gray-100 text-gray-600"
//                   }`}
//                 >
//                   {currentReport.upvotes}
//                 </span>
//               </Button>
//             )}
//             <Link href="/reports/add">
//               <Button className="bg-green-600 hover:bg-green-700 text-white">
//                 New Issue
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//         {/* Left Column: Timeline */}
//         <div className="lg:col-span-3">
//           {/* Main Description as First "Comment" */}
//           <div className="flex gap-4 pb-0 relative group">
//             {/* Timeline connector */}
//             <div className="absolute top-0 bottom-0 w-px bg-gray-200 left-[20px] -z-10"></div>

//             {/* Avatar */}
//             <div className="flex-shrink-0 z-10">
//               <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-gray-600">
//                 <span className="font-medium text-sm">
//                   {currentReport.creator?.fullName?.charAt(0).toUpperCase() ||
//                     "U"}
//                 </span>
//               </div>
//             </div>

//             {/* Content Box */}
//             <div className="flex-1 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
//               <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2 text-sm">
//                 <span className="font-semibold text-gray-900">
//                   {currentReport.creator?.fullName}
//                 </span>
//                 <span className="text-gray-500">
//                   commented on{" "}
//                   {new Date(currentReport.createdAt).toLocaleDateString()}
//                 </span>
//               </div>

//               <div className="p-4">
//                 <p className="text-gray-800 mb-4 whitespace-pre-wrap">
//                   {currentReport.description}
//                 </p>
//                 {currentReport.imageUrl &&
//                   currentReport.imageUrl.length > 0 && (
//                     <div className="mt-4">
//                       <h4 className="text-sm font-medium text-gray-500 mb-2">
//                         Attached Images
//                       </h4>
//                       <div className="flex flex-wrap gap-2">
//                         {(Array.isArray(currentReport.imageUrl)
//                           ? currentReport.imageUrl
//                           : [currentReport.imageUrl]
//                         ).map((img, idx) => (
//                           <div
//                             key={idx}
//                             className="relative h-48 w-full md:w-auto md:min-w-[200px] rounded-lg overflow-hidden border border-gray-200"
//                           >
//                             <Image
//                               src={img}
//                               alt="Report attachment"
//                               fill
//                               className="bg-gray-50 object-cover"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//               </div>
//             </div>
//           </div>

//           {/* Activity Feed */}
//           {currentActivities.map((activity) => (
//             <TimelineItem key={activity.id} activity={activity} />
//           ))}

//           {/* Comment Composer */}
//           {currentReport.status !== ReportStatus.ARCHIVED && (
//             <div className="flex gap-4 pt-6 relative">
//               <div className="flex-shrink-0">
//                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                   {/* Current User Avatar Placeholder */}
//                   <svg
//                     className="w-5 h-5 text-gray-400"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </div>
//               </div>
//               <div className="flex-1">
//                 {currentReport.status === ReportStatus.RESOLVED ? (
//                   <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center text-gray-500 text-sm">
//                     This issue has been marked as resolved. Comments are
//                     disabled.
//                   </div>
//                 ) : (
//                   <CommentBox reportId={reportId} />
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Right Sidebar */}
//         <div className="lg:col-span-1 space-y-6">
//           {/* Sidebar Groups */}
//           {currentReport.status !== ReportStatus.ARCHIVED && (
//             <div className="border-b border-gray-200 pb-4">
//               <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
//                 Assignees
//               </h3>
//               <div className="text-sm text-gray-500 italic">
//                 No one assigned
//               </div>
//             </div>
//           )}

//           <div className="border-b border-gray-200 pb-4">
//             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
//               Labels
//             </h3>
//             <div className="flex flex-wrap gap-2">
//               <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200">
//                 {currentReport.category || "Issue"}
//               </span>
//               <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
//                 {currentReport.status}
//               </span>
//             </div>
//           </div>

//           <div className="border-b border-gray-200 pb-4">
//             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
//               Projects
//             </h3>
//             <div className="text-sm text-gray-500 italic">None yet</div>
//           </div>

//           <div className="border-b border-gray-200 pb-4">
//             <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
//               Location
//             </h3>
//             <div className="rounded-lg overflow-hidden h-40 border border-gray-200 relative mb-2">
//               <Map
//                 lat={currentReport.latitude}
//                 lng={currentReport.longitude}
//                 zoom={15}
//                 className="w-full h-full"
//               />
//             </div>
//             <div className="text-xs text-gray-500 flex justify-between">
//               <span>Lat: {currentReport.latitude.toFixed(4)}</span>
//               <span>Lng: {currentReport.longitude.toFixed(4)}</span>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="pt-2 space-y-2">
//             {currentReport.status !== ReportStatus.RESOLVED &&
//             currentReport.status !== ReportStatus.ARCHIVED ? (
//               <button
//                 onClick={handleResolve}
//                 className="w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1"
//               >
//                 Mark as resolved
//               </button>
//             ) : (
//               <button
//                 disabled
//                 className="w-full text-left text-sm text-gray-400 py-1 cursor-not-allowed"
//               >
//                 Report resolved
//               </button>
//             )}
//             <button className="w-full text-left text-sm text-gray-700 hover:text-blue-600 py-1">
//               Lock conversation
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportIssueLayout;
