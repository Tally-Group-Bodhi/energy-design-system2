"use client";

import React from "react";
import Button from "@/components/Button/Button";
import Badge from "@/components/Badge/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/Table/Table";
import { Icon } from "@/components/ui/icon";
import EosPageHeader from "../components/eos-page-header";
import EosSectionHeader from "../components/eos-section-header";
import EosResultsToolbar from "../components/eos-results-toolbar";
import { BATCH_UPLOAD_ROWS } from "../eos-mock-data";

export default function BatchEnrollPaymentsView() {
  const [dragOver, setDragOver] = React.useState(false);

  return (
    <div className="space-y-6">
      <EosPageHeader
        icon="upload_file"
        crumbs={[
          { label: "EOS" },
          { label: "Acquisitions" },
          { label: "Batch Enroll Payments Upload" },
        ]}
        title="Batch Enroll Payments Upload"
        description="Upload payment files in bulk and track processing status across divisions."
        actions={
          <Button variant="outline" size="sm" type="button">
            <Icon name="download" size={16} className="mr-1.5" />
            Download template
          </Button>
        }
      />

      <section className="overflow-hidden rounded-xl border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:p-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                How to upload a batch enroll payments file
              </h2>
              <p className="text-sm text-muted-foreground">
                Three steps to submit your payment batch.
              </p>
            </div>
            <ol className="space-y-3">
              {[
                {
                  title: "Create your file",
                  desc: (
                    <>
                      Use our XLSX template to format the rows correctly.{" "}
                      <button type="button" className="font-medium text-[#00D2A2] hover:underline">
                        Download template
                      </button>
                    </>
                  ),
                },
                {
                  title: "Save with a unique filename",
                  desc: "Save as .xlsx with a name that hasn't been used before so you can find it again later.",
                },
                {
                  title: "Drag and drop or browse",
                  desc: "Drop the file into the upload area on the right, or browse to attach it from your computer.",
                },
              ].map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2C365D]/10 text-xs font-semibold text-[#2C365D] dark:bg-[#7c8cb8]/15 dark:text-[#7c8cb8]">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {step.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Upload file(s) <span className="text-[#C40000]">*</span>
              </label>
              <span className="text-xs text-muted-foreground">XLSX • Max 10 MB</span>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
              }}
              className={
                "flex min-h-[200px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-gray-50/80 px-4 py-8 text-center transition-colors dark:bg-gray-800/40 " +
                (dragOver
                  ? "border-[#00D2A2] bg-[#E8FBF5]"
                  : "border-border hover:border-[#2C365D]/40 dark:border-gray-600")
              }
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
                <Icon name="cloud_upload" size={24} className="text-[#2C365D] dark:text-[#7c8cb8]" />
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Drag &amp; drop files here
                </p>
                <p className="text-xs text-muted-foreground">
                  or click below to browse
                </p>
              </div>
              <Button variant="primary" size="sm" type="button">
                <Icon name="folder_open" size={16} className="mr-1.5" />
                Browse files
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
        <EosSectionHeader
          title="Upload history"
          description="Recent batch payment uploads"
          actions={
            <>
              <Button variant="ghost" size="icon" aria-label="Refresh">
                <Icon name="refresh" size={18} />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Settings">
                <Icon name="settings" size={18} />
              </Button>
            </>
          }
        />

        <EosResultsToolbar totalCount={BATCH_UPLOAD_ROWS.length} filterPlaceholder="Filter by file name, division…" />

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-gray-800/60">
                {[
                  "File name",
                  "Date",
                  "Status",
                  "Created by",
                  "Records",
                  "Division",
                  "",
                ].map((col, i) => (
                  <TableHead
                    key={`${col}-${i}`}
                    className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300"
                  >
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {BATCH_UPLOAD_ROWS.map((row) => (
                <TableRow key={row.fileName}>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="description" size={18} className="text-muted-foreground" />
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {row.fileName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.date}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "Completed" ? "success" : "info"}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{row.createdBy}</TableCell>
                  <TableCell className="text-sm">{row.recordCount.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">{row.division}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" aria-label="More actions">
                      <Icon name="more_vert" size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
