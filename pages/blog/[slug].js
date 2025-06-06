import Head from 'next/head';
import Layout from '../../components/Layout';
import { getAllPostIds, getPostData } from '../../lib/posts';
import styles from '../../styles/index.module.css';
import AdSenseBanner from '../../components/AdSenseBanner';

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.slug);
    return { props: { postData } };
}

export async function getStaticPaths() {
    const paths = getAllPostIds();
    return { paths, fallback: false };
}

export default function Post({ postData }) {
    const siteUrl = "https://onlinetimerpro.com"; // Change to your domain
    const structuredData = { /* ... a copy of the structured data from my previous response */ };

    return (
        <Layout showSidebar>
            <Head>
                <title>{postData.title}</title>
                <meta name="description" content={postData.excerpt} />
                {/* Your structured data script would go here */}
            </Head>
            <article className={styles.postContainer}>
                {/* === BANNER AD PLACEMENT === */}
                <div className={styles.articleTopBanner}>
                    <AdSenseBanner
                        // IMPORTANT: Replace with your actual Publisher and Slot IDs
                        // This should be a "Leaderboard" or other horizontal ad unit
                        client="ca-pub-XXXXXXXXXX"
                        slot="YOUR_BANNER_AD_SLOT_ID"
                        format="auto"
                    />
                </div>
                {/* === END OF BANNER AD === */}
                <header className={styles.postHeader}>
                    <h1 className={styles.postTitle}>{postData.title}</h1>
                </header>
                <img src={postData.coverImage} alt={postData.title} className={styles.postCoverImage} />
                {/* This div converts your simple markdown into perfect SEO-friendly HTML */}
                <div className={styles.postContent} dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    );
}