import SignUpForm from "@/components/signUpForm";
import SignInForm from "@/components/signInForm"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import InstantTestCode from "@/components/instantTestCode"


export default function Root() {
  return (
    <div className="flex justify-center items-start min-h-screen dark:bg-black pt-10">
      <Tabs defaultValue="instanttest" className="w-fit">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="instanttest">Instant Test</TabsTrigger>
        </TabsList>
        <TabsContent value="signin" className="w-full bg-gray-100 dark:bg-gray-800">
          <SignInForm />
        </TabsContent>
        <TabsContent value="signup" className="w-full bg-gray-100 dark:bg-gray-800">
          <SignUpForm />
        </TabsContent>
        <TabsContent value="instanttest" className="w-full bg-gray-100 dark:bg-gray-800">
          <InstantTestCode />
        </TabsContent>
      </Tabs>
    </div>
  );
}
