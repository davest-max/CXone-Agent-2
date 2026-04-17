"use client"

import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  type ImperativePanelGroupHandle,
} from "react-resizable-panels"

import { cn } from "@/lib/utils"

type GroupProps = React.ComponentProps<typeof PanelGroup>
type PanelProps = React.ComponentProps<typeof Panel>
type HandleProps = React.ComponentProps<typeof PanelResizeHandle> & {
  withHandle?: boolean
}

function ResizablePanelGroup({
  className,
  ...props
}: GroupProps) {
  return (
    <PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        "flex h-full w-full aria-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({ ...props }: PanelProps) {
  return <Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: HandleProps) {
  return (
    <PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        "group relative flex w-4 cursor-col-resize items-center justify-center focus-visible:outline-none",
        className
      )}
      {...props}
    >
      {/* Full-height line — fades in on hover, turns blue on drag */}
      <div className="absolute inset-y-0 w-0.5 rounded-full bg-transparent transition-colors duration-150 group-data-[resize-handle-state=hover]:bg-[#D2D8DB] group-data-[resize-handle-state=drag]:bg-[#007CBE]" />
      {/* Center drag pill */}
      {withHandle && (
        <div className="relative z-10 h-8 w-1 rounded-full bg-[#D2D8DB] transition-colors duration-150 group-data-[resize-handle-state=hover]:bg-[#526b7a] group-data-[resize-handle-state=drag]:bg-[#007CBE]" />
      )}
    </PanelResizeHandle>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
