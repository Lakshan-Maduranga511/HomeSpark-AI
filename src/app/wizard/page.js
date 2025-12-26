import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import WizardForm from "../../../components/wizard/WizardForm";

export const metadata = {
  title: "Renovation Wizard - Homespark",
  description:
    "Tell us about your renovation preferences and get personalized recommendations.",
};

export default function WizardPage() {
  return (
    <>
      <Header />
      <main>
        <WizardForm />
      </main>
      <Footer />
    </>
  );
}
