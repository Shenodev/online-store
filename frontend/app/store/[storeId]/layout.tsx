import Link from "next/link";
import { CartDrawer } from "@/components/CartDrawer";
import { CartNavButton } from "@/components/CartNavButton";
import { CartUIProvider } from "@/components/CartUIProvider";
import { Navbar } from "@/components/Navbar";

/**
 * Store section shell: cart provider + navbar with live store-scoped cart
 * button + sliding drawer, shared by the catalog and product detail routes.
 */
export default function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  return (
    <CartUIProvider>
      <Navbar
        actions={
          <>
            <CartNavButton storeId={params.storeId} />
            <Link href="/admin/dashboard" className="btn-ghost">
              Admin
            </Link>
          </>
        }
      />
      {children}
      <CartDrawer />
    </CartUIProvider>
  );
}
