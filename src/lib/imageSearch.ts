import { toast } from "react-hot-toast";

export const handleImageSearch = async (imageQuery: string) => {
   const params = {
      q: `comida fofo cartoon ${imageQuery}`,
      api_key: `${process.env.NEXT_PUBLIC_SERPAPI_SEARCH_API_KEY}`,
      google_domain: 'google.com.br',
      location: 'Brazil',
      no_cache: 'false',
      gl: 'br',
      hl: 'pt-br',
      tbm: 'isch',
      num: '10',
      safe: 'active',
   };

   const response = await fetch(`/api/imageSearch?${new URLSearchParams(params).toString()}`).then((res) => res.json());

   if (response.search_metadata.status !== 'Success') {
      toast.error('Erro ao buscar imagens');
      return;
   } else if (response.search_information.total_results === '0') {
      toast.error('Nenhuma imagem encontrada');
      return;
   }

   toast.success('Imagens encontradas');
   return response.images_results.map((image: any) => image.original).filter((image: string) => image.startsWith('https://'))
};