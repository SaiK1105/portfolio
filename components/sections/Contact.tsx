"use client";

import { useState } from "react";
import { Window } from "@/components/os/Window";
import { site } from "@/lib/site";

type Row = {
  key: string;
  cmd: string;
  display: string;
  href: string;
  copyValue: string;
  external?: boolean;
};

const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "");

const ROWS: Row[] = [
  {
    key: "email",
    cmd: "$ echo $EMAIL →",
    display: site.email,
    href: `mailto:${site.email}`,
    copyValue: site.email,
  },
  {
    key: "github",
    cmd: "$ open github →",
    display: stripProtocol(site.github),
    href: site.github,
    copyValue: site.github,
    external: true,
  },
  {
    key: "linkedin",
    cmd: "$ open linkedin →",
    display: stripProtocol(site.linkedin),
    href: site.linkedin,
    copyValue: site.linkedin,
    external: true,
  },
  {
    key: "phone",
    cmd: "$ open tel →",
    display: site.phone,
    href: `tel:${site.phone.replace(/\s+/g, "")}`,
    copyValue: site.phone,
  },
];

const COPY_RESET_MS = 1400;

/** A mailto.sh row's copy affordance — copies the raw value, not the href. */
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable — the value is still visible/selectable in the row */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), COPY_RESET_MS);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`shrink-0 rounded-[4px] border px-[9px] py-[5px] font-mono text-[10.5px] uppercase tracking-[0.06em] transition-colors ${
        copied
          ? "border-green text-green"
          : "border-border text-muted hover:border-amber hover:text-amber"
      }`}
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

/**
 * Contact — "contact — mailto.sh": each row pairs a real link (mailto,
 * github, linkedin, tel) with a copy-to-clipboard affordance. Data
 * comes straight from lib/site.ts.
 */
export function Contact() {
  return (
    <Window id="contact" title="contact — mailto.sh" aria-label="Contact">
      <div className="divide-y divide-border">
        {ROWS.map((row) => (
          <div
            key={row.key}
            className="flex flex-wrap items-center justify-between gap-3 px-[22px] py-[14px] text-[13px]"
          >
            <span className="flex flex-wrap items-baseline gap-1.5">
              <span className="text-muted">{row.cmd}</span>
              <a
                href={row.href}
                {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-text underline-offset-4 hover:underline"
              >
                {row.display}
              </a>
            </span>
            <CopyButton value={row.copyValue} />
          </div>
        ))}
      </div>
    </Window>
  );
}
