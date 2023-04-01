import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";

const CreatePostWizzard = () => {
  const { user } = useUser();

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },

    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post, please try again later!");
      }
    },
  });

  const [input, setInput] = useState<string>("");

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        className="h-14 w-14 rounded-full"
        src={user.profileImageUrl}
        alt="avatar"
        width={56}
        height={56}
      />
      <input
        className="grow bg-transparent outline-none"
        placeholder="Type some emojis!"
        value={input}
        disabled={isPosting}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input })
            }
          }
        }}
      />
      {input !== "" && !isPosting && (
          <button type="submit" onClick={() => mutate({ content: input })}>Post</button>
      )}
      {isPosting && (
        <div className="flex justify-center items-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div
      className="flex items-center gap-3 border-b border-slate-400 p-4"
      key={post.id}
    >
      <Image
        className="h-14 w-14 rounded-full"
        src={author.profileImageUrl}
        alt="avatar"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex items-center text-slate-300 gap-1">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin text-xs">{` · ${dayjs(post.createdAt).fromNow()}`}</span>
            </Link>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />
  
  if(!data) return <div>Something went wrong...</div>
  
  return (
    <div>
            {data.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
  )
}

const Home: NextPage = () => {
  api.posts.getAll.useQuery();

  const {isLoaded: userLoaded, isSignedIn } = useUser();
  
  if(!userLoaded) return <div/>

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-200 p-4">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}    
            {!!isSignedIn && <CreatePostWizzard />}
          </div>
          <Feed/>
        </div>
      </main>
    </>
  );
};

export default Home;
