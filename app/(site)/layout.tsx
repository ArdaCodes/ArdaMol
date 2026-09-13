import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import { ThemeProvider } from "@/components/ThemeProvider";
import { prisma } from "@/lib/prisma";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const allSettings = await prisma.setting.findMany();
  const s: Record<string, string> = {};
  for (const item of allSettings as any[]) s[item.key] = item.value;

  return (
    <ThemeProvider>
      <CustomCursor />
      <Header
        siteTitle={s.siteTitle || "Arda Mol"}
        navHome={s.navHome || "Home"}
        navNotes={s.navNotes || "Notes"}
        navProjects={s.navProjects || "Projects"}
        navAbout={s.navAbout || "About"}
        navArchive={s.navArchive || "Archive"}
      />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer
        siteTitle={s.siteTitle || "Arda Mol"}
        footerTagline={s.footerTagline}
        exploreLabel={s.exploreLabel}
        navNotes={s.navNotes}
        navProjects={s.navProjects}
        navArchive={s.navArchive}
        elsewhereLabel={s.elsewhereLabel}
        socialGithub={s.socialGithub}
        socialTwitter={s.socialTwitter}
        socialEmail={s.socialEmail}
        copyrightText={s.copyrightText}
      />
    </ThemeProvider>
  );
}