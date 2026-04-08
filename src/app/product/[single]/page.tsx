import AddToCartButton from "@/components/AddToCartButton";
import ImageFallback from "@/helpers/ImageFallback";
import MDXContent from "@/helpers/MDXContent";
import { getSinglePage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import SeoMeta from "@/partials/SeoMeta";
import { Product } from "@/types";

export const dynamicParams = false;

// generate static params
export const generateStaticParams: () => { single: string }[] = () => {
  const products: Product[] = getSinglePage("product");

  const paths = products.map((product) => ({
    single: product.slug!,
  }));

  return paths;
};

const ProductSingle = async (props: {
  params: Promise<{ single: string }>;
}) => {
  const params = await props.params;
  const products: Product[] = getSinglePage("product");
  const product = products.filter((p) => p.slug === params.single)[0];

  const { frontmatter, content } = product;
  const { title, meta_title, description, image, price } = frontmatter;

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <section className="section pt-7">
        <div className="container">
          <div className="row justify-center">
            <article className="lg:col-10">
              <div className="row items-center mb-10">
                {image && (
                  <div className="md:col-6">
                    <ImageFallback
                      src={image}
                      height={500}
                      width={500}
                      alt={title}
                      className="w-full rounded"
                    />
                  </div>
                )}
                <div className="md:col-6 pt-5 md:pt-0">
                  <h1
                    dangerouslySetInnerHTML={markdownify(title)}
                    className="h2 mb-4"
                  />
                  <p className="mb-4 text-2xl font-bold text-primary">
                    {price}
                  </p>
                  <p className="mb-6">{description}</p>
                  <AddToCartButton
                    product={{
                      slug: product.slug!,
                      title,
                      price,
                      image: image || "",
                    }}
                  />
                </div>
              </div>
              <div className="content mb-10 mt-10">
                <MDXContent content={content} />
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductSingle;
