import Link from "next/link";

import {useTranslations} from 'next-intl';


export default function Home() {
  const t = useTranslations();

  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ul>
        <li><Link className="btn" href="/about">About</Link></li>
        <li><Link className="btn" href="/admin">{t("navigation.admin")}</Link></li>
        <li><Link className="btn" href="/posts">Ads</Link></li>
        <li><Link className="btn" href="/cookie-policy">Cookie Policy</Link></li>
        <li><Link className="btn" href="/create-ad">Create ad</Link></li>
        <li><Link className="btn" href="/dashboard">Dashboard</Link></li>
        <li><Link className="btn" href="/sign-in">Sign in</Link></li>
        <li><Link className="btn" href="/sign-up">Sign up</Link></li>
        <li><Link className="btn" href="/support">Support</Link></li>
        <li><Link className="btn" href="/welcome">Welcome</Link></li>
      </ul>
    </main>
  );
}
