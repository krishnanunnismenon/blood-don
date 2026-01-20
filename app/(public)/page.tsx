import { BloodRequestForm } from "@/components/blood-request-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <Badge className="bg-red-100 text-red-700">Community Blood Network</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Help save lives with fast blood donation requests
          </h1>
          <p className="text-lg text-slate-600">
            Create a verified blood request in minutes. Once approved, our n8n
            workflow broadcasts to trusted channels and keeps donors updated in
            real time.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase text-slate-500">Avg approval</p>
              <p className="text-2xl font-semibold text-slate-900">&lt; 1 hr</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase text-slate-500">Response time</p>
              <p className="text-2xl font-semibold text-slate-900">&lt; 30 min</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white/80 p-4">
              <p className="text-xs uppercase text-slate-500">Trusted donors</p>
              <p className="text-2xl font-semibold text-slate-900">500+</p>
            </div>
          </div>
        </div>
        <Card className="border-slate-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle>Request Blood Donation</CardTitle>
            <CardDescription>
              Fill out the patient details and contact information. We will
              review and broadcast once verified.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BloodRequestForm />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Submit Request",
            description:
              "Provide patient details and hospital contact. We validate for accuracy.",
          },
          {
            title: "Admin Approval",
            description:
              "Admins verify the request and trigger the n8n broadcast workflow.",
          },
          {
            title: "Donor Responses",
            description:
              "Donors respond in real time, and you can track responses instantly.",
          },
        ].map((step) => (
          <Card key={step.title} className="border-slate-200 bg-white/90">
            <CardHeader>
              <CardTitle>{step.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Recent Success Stories</CardTitle>
            <CardDescription>
              Approved requests are broadcasted within minutes across verified
              channels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-slate-600">
              <p>O+ emergency request fulfilled in 3 hours at City Hospital.</p>
              <p>A- urgent request fulfilled in 5 hours at Riverside Clinic.</p>
              <p>AB+ routine request fulfilled in 1 day at Metro Medical.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Privacy & Trust</CardTitle>
            <CardDescription>
              Patient contact details stay protected. Admins verify every request
              before broadcast.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Rate limiting and spam checks on public forms.</li>
              <li>Contact info visible only to administrators.</li>
              <li>Audit-friendly tracking with unique request IDs.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
