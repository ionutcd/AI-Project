const Userquery = require("../../../models/UserQuery");

const {
  Document,
  VectorStoreIndex,
  storageContextFromDefaults,
  SimpleVectorStore,
  BaseIndexStore,
  ChromaVectorStore,
  ClipEmbedding,
  IngestionPipeline,
  MetadataMode,
  OpenAIEmbedding,
  TitleExtractor,
  SimpleNodeParser,
} = require("llamaindex");
const fs = require("fs");
const textract = require("textract");
const { indexStore } = require("./chat");
const { activePrompt } = require("../../../prompts");
const { syncIndexes } = require("mongoose");

const getText = async (filepath) => {
  return new Promise((resolve, reject) => {
    textract.fromFileWithPath(filepath, (err, txt) => {
      if (err) {
        console.error(`Error extracting text from ${filepath}: ${err.message}`);
        resolve(""); // Resolve with an empty string or handle the error differently
      } else {
        resolve(txt);
      }
    });
  });
};

const storeVectorDB = async (req, res) => {
  try {
    const { file_id, path } = req.body;

    if (!file_id || !path) {
      return res.status(400).json({ error: "Invalid payload" });
    }
    const content = await getText(path);

    const document = new Document({ text: content, id_: file_id });

    const vectorStore = new SimpleVectorStore();
    vectorStore.storesText = true;
    const pipeline = new IngestionPipeline({
      transformations: [
        new SimpleNodeParser({ chunkSize: 1024, chunkOverlap: 20 }),
        new TitleExtractor(),
        new OpenAIEmbedding(),
      ],
      // vectorStore,
    });

    // run the pipeline
    const nodes = await pipeline.run({ documents: [document] });

    await vectorStore.add(nodes);

    await vectorStore.persist("./Store/vs");
    // const index = await VectorStoreIndex.fromVectorStore({ vectorStore });
    const index = await VectorStoreIndex.fromDocuments([document], {
      vectorStore,
    });
    console.log("store db-----------", index);

    // const struct = await index.indexStore.getIndexStruct();
    // Save the serialized index to a file
    // fs.writeFileSync("index.data", serializedIndex);@@

    // let activeModel = "";
    // const isPresent = indexStore.find((index) => index.user == req.token._id);

    // if (!isPresent) {
    //   console.log("indexStore-0------", indexStore);
    //   indexStore.push({
    //     user: req.token._id,
    //     indexes: { [activePrompt]: [{ modelId: 1, index }] },
    //   });
    //   console.log("indexStore-1------", indexStore);
    //   activeModel = 1;
    // } else {
    //   activeModel = 1;
    //   // isPresent.indexes[activePrompt] = isPresent.indexes[activePrompt] || [];
    //   // const indexes = isPresent.indexes[activePrompt];
    //   // const modelId = indexes.length
    //   //   ? indexes[indexes.length - 1].modelId + 1
    //   //   : 1;
    //   // activeModel = modelId;
    //   // isPresent.indexes[activePrompt].push({ modelId, index });
    // }

    // // return res.send(index);
    // // generating and saving lamaindex vector and then changing the status of file

    // req.body.files.forEach((file) => {
    //   const { id } = file;
    //   let activePromptFiles = userQuery.files
    //     ? userQuery.files[activePrompt]
    //     : [];
    //   activePromptFiles = !activePromptFiles ? [] : activePromptFiles;
    //   const filePresent = activePromptFiles.find((file) => file.id == id);
    //   if (filePresent && activePromptFiles.length) {
    //     filePresent.retrained = true;
    //   } else {
    //     return res.status(400).send("No file found with provided id");
    //   }
    // });

    // const indexStoreUpdated = indexStore.find(
    //   (index) => index.user == req.token._id
    // );
    // const models = indexStoreUpdated.indexes[activePrompt].map(
    //   (index) => index.modelId
    // );
    // const newUserQuery = new Userquery(userQuery);
    // const result = await newUserQuery.save();
    // res
    // .status(200)
    // .json({ models, files: userQuery.files[activePrompt], activeModel });
    res.status(200).json({ msg: "ok" });
  } catch (error) {
    res.status(501).json(error.message);
    console.log("catch block error", error.message);
  }
};

module.exports = storeVectorDB;
