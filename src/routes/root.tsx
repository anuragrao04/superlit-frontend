import SignUpForm from "@/components/signUpForm";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import InstantTestCode from "@/components/instantTestCode"


export default function Root() {
  return (
    <div className="flex justify-center items-start min-h-screen bg-black pt-10">
      <Tabs defaultValue="instanttest">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="instanttest">Instant Test</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
        </TabsContent>
        <TabsContent value="signup">
          <SignUpForm />
        </TabsContent>
        <TabsContent value="instanttest">
          <InstantTestCode />
        </TabsContent>
      </Tabs>
    </div>
  );
}
