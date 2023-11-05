// Tired of making test file names by hand,
// so I made this function to do it for me.
// Accepts __filename as input and returns a string
// with test name matching file name.
export const makeTestFileName = (filename: string): string => {
  return `${formatTestFileName(filename)} Test`;
};

const formatTestFileName = (filename: string): string => {
  let index = filename.lastIndexOf('/src/');
  if (index < 0) index = filename.lastIndexOf('\\src\\');
  if (index < 0) filename.lastIndexOf('/dist/');
  if (index < 0) filename.lastIndexOf('\\dist\\');
  if (index < 0) {
    throw new Error('formatTestFileName: filename does not contain /src/ or /dist/');
  }
  return filename.substring(index + 1); // +1 to remove the slash
};
