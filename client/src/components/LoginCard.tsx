import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

export const LoginCard = () => {
    return (
        <div >
         <Card className="w-[400px]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Fill in your information</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Email</Label>
                    <Input id="name" placeholder="john@hotmail.com" />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">Pasword</Label>
                    <Input id="Password" placeholder="password" />
                    </div>
                </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Login</Button>
            </CardFooter>
        </Card>      
        </div>
    )
}

export default LoginCard

