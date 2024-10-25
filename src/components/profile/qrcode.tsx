import { format } from "date-fns";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";
import { type FunctionComponent } from "react";
import { LuQrCode, LuUserCircle } from "react-icons/lu";

import { Button } from "~/components/ui/button";
import {
  DialogDrawer,
  DialogDrawerContent,
  DialogDrawerDescription,
  DialogDrawerHeader,
  DialogDrawerTitle,
  DialogDrawerTrigger,
} from "~/components/ui/custom/dialog-drawer";

import { type User, useUser } from "~/store";
import { idToPid } from "~/utils/id";

const QRCode: FunctionComponent<{
  className?: string;
}> = ({ className }) => {
  const { user } = useUser();
  if (!user) return null;
  return <InnerQRCode user={user} className={className} />;
};

const InnerQRCode: FunctionComponent<{
  user: User;
  className?: string;
}> = ({ user, className }) => {
  const router = useRouter();

  if (!user.memberSince)
    // return (
    //   <Button
    //     className={className}
    //     onClick={async () => {
    //       await router.push("/register");
    //     }}
    //   >
    //     Register
    //     <LuUserCircle className="ml-2 size-5" />
    //   </Button>
    // );
    return null;

  return (
    <DialogDrawer>
      <DialogDrawerTrigger asChild>
        <Button className={className}>
          QR
          <LuQrCode className="ml-2 size-5" />
        </Button>
      </DialogDrawerTrigger>
      <DialogDrawerContent>
        <DialogDrawerHeader className="space-y-4 text-white">
          <DialogDrawerTitle className="text-center text-white">
            Your QR Code
          </DialogDrawerTitle>
          <DialogDrawerDescription className="text-center">
            {idToPid(user.id, format(user.memberSince, "yy"))}
          </DialogDrawerDescription>
          <QRCodeSVG
            value={idToPid(user.id, format(user.memberSince, "yy"))}
            size={130}
            bgColor="transparent"
            color="#ffffff"
            fgColor="#ffffff"
            className={"mx-auto size-52"}
          />
        </DialogDrawerHeader>
      </DialogDrawerContent>
    </DialogDrawer>
  );
};

export default QRCode;
