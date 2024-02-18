"use client";

import AutoForm from "@/components/auto-form";
import { useCeramicContext } from "@/ceramicContext";
import { Button } from "@/components/ui/button";
import { UserProfileSchema } from "@/schemas/ceramic.schema";
import { useUpdateProfile } from "@/lib/ceramic/useUpdateProfile";

export const UserProfileForm = (props: {
  data?: UserProfileSchema;
}) => {
  const { canAuthenticate, authenticate, composeClient, isAuthenticated } =
    useCeramicContext();

  const handleUpdateProfile = useUpdateProfile();
  return (
      <>
          <Button
              onClick={() => {
                  authenticate?.mutate();
              }}
              disabled={
                  isAuthenticated || !canAuthenticate || authenticate?.isPending
              }
          >
              {isAuthenticated ? "Authenticated" : "Authenticate"}
          </Button>
          {
              isAuthenticated && (
                  <AutoForm
                      values={props.data}
                      className={"p-4"}
                      formSchema={UserProfileSchema}
                      onSubmit={handleUpdateProfile.mutate}
                  >
                      <Button
                          className={handleUpdateProfile.isPending ? "opacity-50" : ""}
                          type="submit"
                          disabled={!isAuthenticated ?? handleUpdateProfile.isPending}
                      >
                          Update Profile
                      </Button>
                  </AutoForm>
                )
          }
      </>
  );
};
