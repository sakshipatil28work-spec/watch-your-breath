"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { gearSvg, arrowLeftSvg, bellSvg, playSvg } from "@/illustrations/glyphs";
import { REMINDERS } from "@/lib/reminders";
import { Toggle } from "./Toggle";
import { Select } from "./Select";
import { FrequencySelector, type Frequency } from "./FrequencySelector";
import { SettingsSection } from "./SettingsSection";
import { NoticePreview, type NotificationLayout } from "./NotificationPreview";
import { Button } from "./Button";

function subscribeMinute(onChange: () => void) {
  const t = setInterval(onChange, 60_000);
  return () => clearInterval(t);
}
const minuteSnapshot = () => Math.floor(Date.now() / 60_000) * 60_000;

const FREQ_LABEL: Record<Frequency, string> = {
  "30": "30 minutes",
  "60": "1 hour",
  "120": "2 hours",
  custom: "custom",
};

/**
 * A working replica of the extension popup, at its real size. Nothing here is
 * saved anywhere; it exists so a visitor can feel the thing before installing.
 */
export function PopupDemo() {
  const [view, setView] = useState<"home" | "settings">("home");
  const [enabled, setEnabled] = useState(true);
  const [frequency, setFrequency] = useState<Frequency>("60");
  const [custom, setCustom] = useState(45);
  const [randomize, setRandomize] = useState(false);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("07:00");
  const [layout, setLayout] = useState<NotificationLayout>("compact");
  const [sound, setSound] = useState(true);

  // a minute clock as an external store, so rendering stays pure and the server render has no time
  const nowMs = useSyncExternalStore(subscribeMinute, minuteSnapshot, () => null);

  const minutes = frequency === "custom" ? custom : Number(frequency);
  const nowDate = nowMs === null ? null : new Date(nowMs);
  const nowMin = nowDate ? nowDate.getHours() * 60 + nowDate.getMinutes() : -1;
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  const qs = toMin(quietStart);
  const qe = toMin(quietEnd);
  const quietNow =
    enabled && nowMin >= 0 && qs !== qe && (qs < qe ? nowMin >= qs && nowMin < qe : nowMin >= qs || nowMin < qe);
  const next =
    nowMs === null
      ? ""
      : new Date(nowMs + minutes * 60_000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div
      className="relative w-[320px] max-w-full bg-cream border-[1.5px] border-ink rounded-[var(--radius-sticker)] px-[22px] pt-[22px] pb-5 text-ink text-[0.875rem] leading-[1.45]"
      style={{ boxShadow: "0 0 0 4px var(--color-paper), 0 3px 10px rgba(36,60,58,0.14)" }}
      data-enabled={enabled}
    >
      {view === "home" ? (
        <section aria-label="Popup, home">
          <button
            type="button"
            onClick={() => setView("settings")}
            aria-label="Settings"
            className="absolute right-2.5 top-2.5 grid place-items-center w-[30px] h-[30px] rounded-full text-ink-soft [@media(hover:hover)]:hover:text-ink motion-safe:[@media(hover:hover)]:hover:rotate-[22deg] active:scale-[0.96] transition-[color,transform] duration-[240ms] [&_svg]:w-5 [&_svg]:h-5"
            dangerouslySetInnerHTML={{ __html: gearSvg() }}
          />
          <Image
            src="/illustrations/sticker.png"
            alt=""
            width={1000}
            height={530}
            className={[
              "w-full h-auto mt-0.5 transition-opacity duration-[240ms]",
              enabled ? "emblem-breath" : "opacity-40",
            ].join(" ")}
            style={{ transformOrigin: "25% 51%" }}
          />
          <p className="sr-only">Watch your breath. Just a moment.</p>

          <div className="mt-[18px] grid gap-3">
            <div className="flex items-center justify-between gap-3 min-h-7">
              <span id="demo-reminders" className="font-medium">
                Reminders
              </span>
              <Toggle checked={enabled} onChange={setEnabled} labelledBy="demo-reminders" />
            </div>
            <FrequencySelector
              id="demo-frequency"
              value={frequency}
              customMinutes={custom}
              onChange={setFrequency}
              onCustomChange={setCustom}
            />
            <div className="flex items-center justify-between gap-3 min-h-7">
              <label htmlFor="demo-layout" className="font-medium">
                Notification
              </label>
              <Select id="demo-layout" value={layout} onChange={(e) => setLayout(e.target.value as NotificationLayout)}>
                <option value="compact" style={{ direction: "ltr" }}>
                  Compact
                </option>
                <option value="expanded" style={{ direction: "ltr" }}>
                  Expanded
                </option>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-3 min-h-7">
              <span id="demo-sound" className="font-medium">
                Sound
              </span>
              <span className="inline-flex items-center gap-1">
                <span
                  aria-hidden="true"
                  className={["w-[18px] h-[18px] [&_svg]:w-full [&_svg]:h-full", sound ? "text-ochre" : "text-ink-faint"].join(" ")}
                  dangerouslySetInnerHTML={{ __html: bellSvg() }}
                />
                <Toggle checked={sound} onChange={setSound} labelledBy="demo-sound" />
              </span>
            </div>
          </div>

          <p className="mt-3.5 text-center text-[0.78rem] text-ink-soft min-h-[1.4em]" aria-live="polite">
            {!enabled
              ? "Reminders are off. Switch them on when you’re ready."
              : quietNow
                ? "Quiet hours now."
                : next
                  ? `Next reminder around ${next.toLowerCase()}.`
                  : ""}
          </p>
        </section>
      ) : (
        <section aria-label="Popup, settings">
          <header className="flex items-center gap-2 -mt-1.5 -ml-2 mb-1.5">
            <button
              type="button"
              onClick={() => setView("home")}
              aria-label="Back"
              className="grid place-items-center w-[30px] h-[30px] rounded-full text-ink-soft [@media(hover:hover)]:hover:text-ink active:scale-[0.96] transition-[color,transform] duration-150 [&_svg]:w-5 [&_svg]:h-5"
              dangerouslySetInnerHTML={{ __html: arrowLeftSvg() }}
            />
            <h3 className="font-display font-semibold text-[22px] leading-none">Settings</h3>
          </header>

          <SettingsSection title="Reminders" id="demo-s-reminders">
            <div className="flex items-center justify-between gap-3 min-h-7">
              <span id="demo-reminders-2" className="font-medium">
                Reminders
              </span>
              <Toggle checked={enabled} onChange={setEnabled} labelledBy="demo-reminders-2" />
            </div>
            <FrequencySelector
              id="demo-frequency-2"
              label="Frequency"
              value={frequency}
              customMinutes={custom}
              onChange={setFrequency}
              onCustomChange={setCustom}
            />
          </SettingsSection>

          <SettingsSection title="Notification" id="demo-s-layout">
            <fieldset className="grid gap-2 border-0 p-0 m-0">
              <legend className="sr-only">Notification layout</legend>
              {(["compact", "expanded"] as const).map((s) => (
                <label key={s} className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="demo-layout"
                    value={s}
                    checked={layout === s}
                    onChange={() => setLayout(s)}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="grid place-items-center w-[18px] h-[18px] bg-[url(/illustrations/ring.png)] bg-[length:100%_100%] peer-focus-visible:outline-2 peer-focus-visible:outline-ink peer-focus-visible:outline-offset-3 after:content-[''] after:w-[9px] after:h-[9px] after:rounded-[62%_38%_55%_45%_/_45%_55%_40%_60%] after:bg-rust after:scale-50 after:opacity-0 peer-checked:after:scale-100 peer-checked:after:opacity-100 after:transition-[transform,opacity] after:duration-150"
                  />
                  <span className="grid leading-tight">
                    <span>{s === "compact" ? "Compact" : "Expanded"}</span>
                    <small className="text-[0.75rem] text-ink-soft">
                      {s === "compact" ? "The drawing and a short reminder" : "The drawing, the reminder and a short reflection"}
                    </small>
                  </span>
                </label>
              ))}
            </fieldset>
            <p className="text-[0.78rem] leading-snug text-ink-soft">
              Reminders arrive as your system’s notifications, at the corner of the screen. The next one reads:
            </p>
            <NoticePreview reminder={REMINDERS[6]} layout={layout} />
          </SettingsSection>

          <SettingsSection title="Sound" id="demo-s-sound">
            <div className="flex items-center justify-between gap-3 min-h-7">
              <span id="demo-sound-2" className="font-medium">
                Reminder sound
              </span>
              <Toggle checked={sound} onChange={setSound} labelledBy="demo-sound-2" />
            </div>
            <Button
              variant="secondary"
              className="justify-self-start px-3.5 py-2 text-[0.84rem] gap-1.5"
              onClick={() => new Audio("/audio/reminder-bell.mp3").play().catch(() => undefined)}
            >
              <span aria-hidden="true" className="w-4 h-4 [&_svg]:w-full [&_svg]:h-full" dangerouslySetInnerHTML={{ __html: playSvg() }} />
              Play bell
            </Button>
          </SettingsSection>

          <SettingsSection
            title="Quiet hours"
            hint={quietNow ? "No reminders between these times. Quiet now." : "No reminders between these times."}
            id="demo-s-quiet"
            marked={quietNow}
          >
            <div className="flex gap-5">
              <label className="grid gap-0.5">
                <span className="text-[0.78rem] text-ink-soft">Start</span>
                <input
                  type="time"
                  value={quietStart}
                  onChange={(e) => setQuietStart(e.target.value)}
                  className={["control-line control-time w-[104px] tabular-nums", quietNow ? "border-b-2 border-b-sage" : ""].join(" ")}
                />
              </label>
              <label className="grid gap-0.5">
                <span className="text-[0.78rem] text-ink-soft">End</span>
                <input
                  type="time"
                  value={quietEnd}
                  onChange={(e) => setQuietEnd(e.target.value)}
                  className={["control-line control-time w-[104px] tabular-nums", quietNow ? "border-b-2 border-b-sage" : ""].join(" ")}
                />
              </label>
            </div>
          </SettingsSection>

          <SettingsSection title="Optional" id="demo-s-optional">
            <div className="grid gap-1">
              <div className="flex items-center justify-between gap-3 min-h-7">
                <span id="demo-randomize" className="font-medium">
                  Randomize reminder timing
                </span>
                <Toggle checked={randomize} onChange={setRandomize} labelledBy="demo-randomize" describedBy="demo-randomize-hint" />
              </div>
              <p id="demo-randomize-hint" className="text-[0.78rem] leading-snug text-ink-soft">
                Lets each reminder drift a little, so it never lands on the same predictable minute.
              </p>
            </div>
          </SettingsSection>

          <SettingsSection title="About" id="demo-s-about">
            <p className="text-[0.84rem] leading-relaxed">
              Watch Your Breath is a small reminder to notice something that is already happening.
            </p>
            <Button variant="quiet" className="justify-self-start text-[0.84rem]" onClick={() => setView("home")}>
              Back to the sticker
            </Button>
          </SettingsSection>
        </section>
      )}
      <span className="sr-only">
        Currently set to every {FREQ_LABEL[frequency]}
        {frequency === "custom" ? ` (${custom} minutes)` : ""}.
      </span>
    </div>
  );
}
