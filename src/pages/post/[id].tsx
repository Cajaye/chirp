import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import PostView from "~/components/post";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/api/helpers/ssgHelper";

import { api } from "~/utils/api";


const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({ postId: id });
  
  if (!data) return <div>404!</div>

  return (
    <>
      <Head>
        <title>{ `${data.post.content} - @${data.author.username}` }</title>
      </Head>
      <PageLayout>
          <PostView {...data} />
      </PageLayout>
    </>
  );
};

export const getStaticProps:GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  
  const id = context.params?.id as string;

  if (typeof id !== "string") {
    throw new Error("Post doesn't exist")
  }
  
  await ssg.posts.getById.prefetch({postId:id});

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    }
  }
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback:"blocking",
  }
}

export default SinglePostPage;