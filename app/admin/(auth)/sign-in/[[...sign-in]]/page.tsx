import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main
      data-admin-auth-page
      className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-10"
    >
      <style>
        {`
          body:has([data-admin-auth-page]) aside,
          body:has([data-admin-auth-page]) header,
          [data-admin-shell]:has([data-admin-auth-page]) [data-admin-sidebar] {
            display: none !important;
          }

          [data-admin-shell]:has([data-admin-auth-page]) > div {
            display: block !important;
            max-width: none !important;
            padding: 0 !important;
          }

          [data-admin-shell]:has([data-admin-auth-page]) [data-admin-main] {
            min-height: 100vh;
          }
        `}
      </style>
      <SignIn />
    </main>
  );
}
