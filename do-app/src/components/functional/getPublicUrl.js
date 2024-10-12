/**
 * Function to generate a URL based on provided folder and filename.
 * If `process.env.PUBLIC_URL` is defined, it will be used as the base URL.
 * Otherwise, the current window location will be used.
 * 
 * @param {Object} options - Optional parameters.
 * @param {string} [options.folder] - The folder name (optional).
 * @param {string} [options.filename] - The filename (optional).
 * @returns {string} - The constructed URL or an empty string in case of an error.
 */
export default function getPublicUrl({ folder = '', filename = '' } = {}) {
    try {
        // Check if folder and filename are strings, if not, convert them to strings
        const folderString = typeof folder === 'string' ? folder.trim() : String(folder ?? '').trim();
        const filenameString = typeof filename === 'string' ? filename.trim() : String(filename ?? '').trim();

        // Get the current URL and construct the base path
        const publicUrl = `${window.location.origin}${window.location.pathname}`;
        const baseFolder = folderString ? `${folderString}/` : '';
        const baseFilename = filenameString || '';

        // Choose URL based on the presence of PUBLIC_URL in process.env
        const tuningUrl = process.env.PUBLIC_URL 
            ? `${process.env.PUBLIC_URL}/${baseFolder}${baseFilename}`
            : `${publicUrl}${publicUrl.endsWith('/') ? '' : '/'}${baseFolder}${baseFilename}`;

        // Check if the URL is valid (this is a placeholder check)
        if (!tuningUrl) {
            throw new Error('Error generating URL');
        }

        return tuningUrl;
    } catch (error) {
        console.error('Error in getPublicUrl:', error.message);
        return '';
    }
}
