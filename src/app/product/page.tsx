import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import config from "@/config/config.json";
import { getListPage, getSinglePage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { Product } from "@/types";

const { pagination } = config.settings;

const Products = () => {
  const productIndex: Product = getListPage("product/_index.md");
  const { title, meta_title, description, image } = productIndex.frontmatter;
  const products: Product[] = getSinglePage("product");
  const totalPages = Math.ceil(products.length / pagination);
  const currentProducts = products.slice(0, pagination);

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <PageHeader title={title} />
      <section className="section">
        <div className="container">
          <div className="row justify-center">
            {currentProducts.map((product: any, index: number) => (
              <div key={index} className="mb-14 lg:col-4 md:col-6">
                <ProductCard data={product} />
              </div>
            ))}
          </div>
          <Pagination
            section="product"
            currentPage={1}
            totalPages={totalPages}
          />
        </div>
      </section>
    </>
  );
};

export default Products;
