import ImageFallback from "@/helpers/ImageFallback";
import { plainify } from "@/lib/utils/textConverter";
import { Product } from "@/types";
import Link from "next/link";

const ProductCard = ({ data }: { data: Product }) => {
  const { title, image, price, description } = data.frontmatter;
  return (
    <div className="bg-body dark:bg-darkmode-body">
      {image && (
        <ImageFallback
          className="mb-6 w-full rounded"
          src={image}
          alt={title}
          width={445}
          height={300}
        />
      )}
      <h4 className="mb-3">
        <Link href={`/product/${data.slug}`}>{title}</Link>
      </h4>
      <p className="mb-2 font-bold text-lg text-primary">{price}</p>
      <p className="mb-6">
        {description || plainify(data.content!.slice(0, 100))}
      </p>
      <Link
        className="btn btn-outline-primary btn-sm"
        href={`/product/${data.slug}`}
      >
        View Details
      </Link>
    </div>
  );
};

export default ProductCard;
