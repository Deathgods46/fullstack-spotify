import { useEffect, useState } from 'react';
import { getMyPlaylists, Playlist } from '../../services/playlistsService';

const MyPlaylists = () => {
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchPlaylists = async () => {
			try {
				const data = await getMyPlaylists();
				setPlaylists(data.data.playlists);
			} catch (error) {
				console.error('Error fetching playlists:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchPlaylists();
	}, []);

	return <></>;
};

export default MyPlaylists;
