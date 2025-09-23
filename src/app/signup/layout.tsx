import React from "react";

// This layout removes header/footer by only rendering children
export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
