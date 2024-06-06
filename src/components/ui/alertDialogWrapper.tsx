import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alertDialog"
import { Button } from "./button"

export default function AlertDialogWrapper({ dialog, dialogRef, onOk }: { dialog: { title: string, description: string }, dialogRef: any, onOk: any | undefined }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild hidden className="h-0 w-0 p-0">
        <Button variant="outline" id="alertDialogTrigger" ref={dialogRef} className="h-0 w-0 p-0"></Button>
      </AlertDialogTrigger>
      {/*we will trigger the above button to show the dialog*/}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialog.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onOk}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
