export const getDecksFromRefs = async (deckRefs: any) => {
    try {
        const deckPromises = deckRefs.map((ref: any)=> ref.get());
        const deckSnaps = await Promise.all(deckPromises);

        const decks = deckSnaps.map(snap => snap.exists? snap.data(): null).filter(data => data !== null);



        return decks;
    }
    catch (error) {
        console.error("Error fetching user decks:", error);
        throw error;
    }
}