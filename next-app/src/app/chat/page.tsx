"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopilotChat } from "@copilotkit/react-core/v2";
import { type InputProps, CopilotKitCSSProperties } from "@copilotkit/react-ui";
import "@copilotkit/react-core/v2/styles.css";
import { useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useRef, useState } from "react";


export default function Page() {
  return (
    <div>
      <CopilotChat className="h-[calc(100vh-90px)] overflow-hidden"/>
    </div>
  );
}