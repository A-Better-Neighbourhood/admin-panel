import { Issue } from "@/lib/api";

export interface LocationCluster {
  id: string;
  center: {
    lat: number;
    lng: number;
  };
  radius: number; // in km
  issues: Issue[];
  count: number;
  topUpvotes: number;
}

// Haversine formula to calculate distance between two coordinates
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Group issues by location AND title (both must match to be same report)
export const groupIssuesByLocationAndTitle = (
  issues: Issue[],
  radiusKm: number = 2
): LocationCluster[] => {
  const clusters: LocationCluster[] = [];
  const processedIssueIds = new Set<string>();

  for (const issue of issues) {
    if (processedIssueIds.has(issue.id)) continue;

    // Start a new cluster with this issue
    const clusterIssues: Issue[] = [issue];
    processedIssueIds.add(issue.id);

    // Find all issues within radius AND with same title
    for (const otherIssue of issues) {
      if (processedIssueIds.has(otherIssue.id)) continue;

      // Check if same location (within radius)
      const distance = calculateDistance(
        issue.latitude,
        issue.longitude,
        otherIssue.latitude,
        otherIssue.longitude
      );

      // Check if same title (case-insensitive)
      const sameTitle = issue.title.toLowerCase().trim() === 
                       otherIssue.title.toLowerCase().trim();

      // Both location AND title must match
      if (distance <= radiusKm && sameTitle) {
        clusterIssues.push(otherIssue);
        processedIssueIds.add(otherIssue.id);
      }
    }

    // Calculate cluster center
    const centerLat =
      clusterIssues.reduce((sum, i) => sum + i.latitude, 0) /
      clusterIssues.length;
    const centerLng =
      clusterIssues.reduce((sum, i) => sum + i.longitude, 0) /
      clusterIssues.length;

    // Calculate cluster radius
    const maxDistance = Math.max(
      ...clusterIssues.map((i) =>
        calculateDistance(centerLat, centerLng, i.latitude, i.longitude)
      )
    );

    // Sort by upvotes descending
    clusterIssues.sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0));

    clusters.push({
      id: `cluster-${issue.id}`,
      center: {
        lat: centerLat,
        lng: centerLng,
      },
      radius: maxDistance,
      issues: clusterIssues,
      count: clusterIssues.length,
      topUpvotes: clusterIssues[0]?.upvoteCount || 0,
    });
  }

  // Sort clusters by top upvotes
  clusters.sort((a, b) => b.topUpvotes - a.topUpvotes);

  return clusters;
};

// Original function - Group issues by location only
export const groupIssuesByLocation = (
  issues: Issue[],
  radiusKm: number = 2
): LocationCluster[] => {
  const clusters: LocationCluster[] = [];
  const processedIssueIds = new Set<string>();

  for (const issue of issues) {
    if (processedIssueIds.has(issue.id)) continue;

    // Start a new cluster
    const clusterIssues: Issue[] = [issue];
    processedIssueIds.add(issue.id);

    // Find all issues within radius
    for (const otherIssue of issues) {
      if (processedIssueIds.has(otherIssue.id)) continue;

      const distance = calculateDistance(
        issue.latitude,
        issue.longitude,
        otherIssue.latitude,
        otherIssue.longitude
      );

      if (distance <= radiusKm) {
        clusterIssues.push(otherIssue);
        processedIssueIds.add(otherIssue.id);
      }
    }

    // Calculate cluster center
    const centerLat =
      clusterIssues.reduce((sum, i) => sum + i.latitude, 0) /
      clusterIssues.length;
    const centerLng =
      clusterIssues.reduce((sum, i) => sum + i.longitude, 0) /
      clusterIssues.length;

    // Calculate cluster radius
    const maxDistance = Math.max(
      ...clusterIssues.map((i) =>
        calculateDistance(centerLat, centerLng, i.latitude, i.longitude)
      )
    );

    // Sort by upvotes descending
    clusterIssues.sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0));

    clusters.push({
      id: `cluster-${issue.id}`,
      center: {
        lat: centerLat,
        lng: centerLng,
      },
      radius: maxDistance,
      issues: clusterIssues,
      count: clusterIssues.length,
      topUpvotes: clusterIssues[0]?.upvoteCount || 0,
    });
  }

  // Sort clusters by top upvotes
  clusters.sort((a, b) => b.topUpvotes - a.topUpvotes);

  return clusters;
};
