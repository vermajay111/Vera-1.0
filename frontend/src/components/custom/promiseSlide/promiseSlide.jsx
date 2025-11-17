import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { Users, CheckCircle2, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
export function PromiseSlide({ children }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col w-full sm:max-w-sm lg:max-w-md bg-black text-white border-r border-gray-800 shadow-2xl"
      >
        <SheetHeader className="space-y-1">
          <SheetTitle className="text-2xl font-semibold text-white tracking-tight">
            Promise Dashboard
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Navigate to your desired option
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden px-4 mt-6">
          <ScrollArea className="h-full w-full rounded-lg border border-gray-800 bg-black/40 backdrop-blur-sm">
            <div className="p-4 space-y-4">
              <h4 className="text-sm font-medium text-purple-300 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Friends & Promises
              </h4>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-700 text-gray-300 hover:bg-purple-900/40 hover:text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Ongoing Promises
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-700 text-gray-300 hover:bg-purple-900/40 hover:text-white"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Completed Promises
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }}>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-700 text-gray-300 hover:bg-purple-900/40 hover:text-white"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  <Link to="/home">Start New Promise</Link>
                </Button>
              </motion.div>
            </div>
          </ScrollArea>
        </div>

        <Separator className="my-4 bg-gray-800" />

        <SheetFooter>
          <SheetClose asChild>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-purple-900/40 hover:text-white rounded-xl"
            >
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
