import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("Web3Forms contact surfaces", () => {
  it("keeps the iyal form specific to field research", () => {
    const iyal = read("../src/pages/iyal.astro");

    expect(iyal).toContain('action="https://api.web3forms.com/submit"');
    expect(iyal).toContain('name="subject" value="iyal field note"');
    expect(iyal).toContain("Your role in the season");
    expect(iyal).toContain("Farmer, lender, buyer, transporter, policy, researcher, operator...");
    expect(iyal).toContain("Where are you working from?");
    expect(iyal).toContain("Village, district, state, country, or the market you know best");
    expect(iyal).toContain("What are you seeing on the ground?");
    expect(iyal).toContain("Tell me what breaks, what works, who is trusted, or what I am probably missing.");
    expect(iyal).toContain("Can I follow up?");
    expect(iyal).toContain("I read these as field notes, not leads in a funnel.");
    expect(iyal).toContain("Email field note");
    expect(iyal).toContain("Send field note");
  });

  it("adds a general contact page with broad inquiry fields", () => {
    const contact = read("../src/pages/contact.astro");

    expect(contact).toContain('action="https://api.web3forms.com/submit"');
    expect(contact).toContain('name="subject" value="Website contact"');
    expect(contact).toContain("What is this about?");
    expect(contact).toContain("Work / AI build");
    expect(contact).toContain("Give me the useful version: context, ask, timeline, and what would make this worth discussing.");
    expect(contact).toContain("I usually reply by email if there is a real thread to pull.");
    expect(contact).toContain("Email Sundharesan");
    expect(contact).toContain("Send note");
  });

  it("routes the footer headline to the contact page", () => {
    const footer = read("../src/components/Footer.astro");

    expect(footer).toContain('href="/contact"');
    expect(footer).toContain("Get in touch");
  });
});
