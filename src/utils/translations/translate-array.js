function translateArray(t,translation_key, source_key, data) {
    
    const mappedData = [];

    for (const item of data) {
        const translatedItem = t(`${translation_key}.${item[source_key]}`); // Adjust the translation key based on your i18n plugin
        mappedData.push({
            ...item,
            [source_key]: translatedItem
        })

    }
    return mappedData;
}

export default translateArray;