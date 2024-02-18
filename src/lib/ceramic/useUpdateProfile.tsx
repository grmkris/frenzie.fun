import { ComposeClient } from "@composedb/client";
import { UserProfileSchema } from "@/schemas/ceramic.schema";
import { useMutation } from "@tanstack/react-query";
import { useCeramicContext } from "@/ceramicContext";
import {toast} from "sonner";

export const updateProfile = async (props: {
  composeClient: ComposeClient;
  profile: UserProfileSchema;
}) => {
  const { composeClient, profile } = props;
  console.log("updating profile", profile, composeClient.did);
  if (composeClient.did === undefined) throw new Error("No DID found");
  const update = await composeClient.executeQuery(`
    mutation {
      createBasicProfile(input: {
        content: {
          name: "${profile?.name}"
          description: "${profile?.description}"
          emoji: "${profile?.emoji}"
          urls: [${profile?.urls?.map(
            (url) => `{ url: "${url.url}", description: "${url.description}" }`,
          )}]
        }
      }) 
      {
        document {
          name
          description
          emoji
          urls { 
           url
           description
          }
        }
      }
    }
      `);
  if (update.errors) {
    alert(update.errors);
  } else {
    const updatedProfile = await composeClient.executeQuery(`
        query {
          viewer {
            basicProfile {
              id
            }
          }
        }
      `);
    // @ts-ignore
    return UserProfileSchema.parse(updatedProfile?.data?.viewer?.basicProfile);
  }
};

export const useUpdateProfile = () => {
  const { composeClient, isAuthenticated } = useCeramicContext();
  return useMutation({
    onSuccess: (data) => {
      console.log("Profile updated", data);
      toast.success("Profile updated");
    },
    mutationFn: async (profile: UserProfileSchema) => {
      if (!composeClient) throw new Error("No client");
      if (!isAuthenticated) throw new Error("Not authenticated");
      return updateProfile({
        composeClient,
        profile,
      });
    },
  });
};
