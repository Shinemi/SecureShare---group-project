
const ImageCard = ({ title, description, image }) => (
    <article className="overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">

        <img className="h-64 w-full object-cover" src={`http://localhost:3000${image}`} alt={title} />

        <div className="p-5">
            <h3 className="mb-3 border-b border-gray-300 pb-2 text-xl font-bold text-gray-900"> {title} </h3>
            <p className="text-sm leading-6 text-gray-600">{description}</p>
            {/* <p
                className="text-sm leading-6 text-gray-600"
                dangerouslySetInnerHTML={{ __html: description }}
            /> */}
        </div>
    </article>
);

export default ImageCard;