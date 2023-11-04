import { BaseStorage, createStorage, StorageType } from '@src/shared/storages/base';

type EmailStorageType = BaseStorage<string> & {
    setEmail: (string) => void;
};

const storage = createStorage<string>('email-storage', '', {
    storageType: StorageType.Local,
});

const emailStorage: EmailStorageType = {
    ...storage,
    setEmail: (myEmail: string) => {
        storage.set(myEmail);
    },
};

export default emailStorage;
