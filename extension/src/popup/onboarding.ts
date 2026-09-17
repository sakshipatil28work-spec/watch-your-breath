import { saveSettings, CUSTOM_MIN, CUSTOM_MAX, type NotificationLayout } from "../lib/settings.ts";
import { formatInterval } from "../lib/schedule.ts";
import { COPY } from "../lib/copy.ts";
import { emblemHtml, chevronDataUri } from "../ui/ink.ts";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

document.documentElement.style.setProperty("--chevron", `url("${chevronDataUri}")`);
$("emblem").innerHTML = emblemHtml();
$("emblem-done").innerHTML = emblemHtml({ rings: true });

const select = $("select-interval") as HTMLSelectElement;
const customRow = $("row-custom");
const customInput = $("input-custom") as HTMLInputElement;
const form = $("form") as HTMLFormElement;

select.addEventListener("change", () => {
  customRow.hidden = select.value !== "custom";
  if (select.value === "custom") customInput.focus();
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const v = select.value;
  const interval = v === "custom" ? "custom" : (Number(v) as 30 | 60 | 120);
  const n = Math.min(CUSTOM_MAX, Math.max(CUSTOM_MIN, Math.round(Number(customInput.value) || 45)));
  const data = new FormData(form);
  const layout = (data.get("layout") === "expanded" ? "expanded" : "compact") as NotificationLayout;
  const soundEnabled = data.get("sound") !== "off";
  const saved = await saveSettings({ enabled: true, interval, customMinutes: n, layout, soundEnabled, onboarded: true });
  $("done-sub").textContent = COPY.onboarding.doneSub(formatInterval(saved));
  $("view-setup").hidden = true;
  $("view-done").hidden = false;
  $("emblem-done").classList.add("is-active");
  $("close").focus();
});

$("close").addEventListener("click", () => window.close());
