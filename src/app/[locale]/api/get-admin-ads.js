import { fetchAdminAdList } from "@/lib/fetchAdminAdList";

export default async function handler(req, res) {
  try {
    const { ads, error } = await fetchAdminAdList();

    if (error) {
      throw new Error(error);
    }

    // Set cache headers
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');

    res.status(200).json({ ads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}