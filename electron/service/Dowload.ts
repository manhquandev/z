import {ipcMain, IpcMainEvent} from 'electron'

const XLSX = require('xlsx')
const request = require('request');
const fs = require('fs');
export default class DowloadService {
    data: any[]

    constructor() {
        this.data = []
        ipcMain.on('read', this.Read)
        ipcMain.on('start', this.startDowload)
    }

    private async Read(_event: IpcMainEvent, _args: string) {
        try {
            const workbook = await XLSX.readFile(_args)
            const data = [];
            for (const sheetName of workbook.SheetNames) {
                const sheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(sheet);
                data.push(sheetData);
            }
            this.data = data
            _event.sender.send('read-done', data)
        } catch (e) {
            console.log(e)
        }
    }

    private startDowload(_event: IpcMainEvent, _args: any) {
        const promises: Array<Promise<void>> = [];
        for (const obj of this.data[0]) {
            const imageUrl = obj.Col3_SRC;
            const filename = imageUrl.split('/').pop();

            const promise = new Promise<void>(async (resolve, reject) => {
                await request(imageUrl, (error: any, _response: any, body: any) => {
                    if (error) {
                        reject(error);
                    } else {
                        fs.writeFile(`out/${filename}`, body, (err: any) => {
                            if (err) {
                                _event.sender.send('download-success', imageUrl)
                                reject(err);
                            } else {
                                resolve();
                            }
                        });
                    }
                });
            });
            promises.push(promise);
        }

        Promise.all(promises).then(() => {
            _event.sender.send('download-success', 'done')
        });
    }

    private async downloadImages() {
        for (let i = 0; i < a.length; i++) {
            const image = a[i];
            const url = image.Col3_SRC;
            const filename = `image_${i}.webp`;

            console.log(`Downloading image ${i + 1}/${a.length}: ${url}`);

            try {
                await downloadImage(url, filename);
                console.log(`Image ${i + 1}/${a.length} downloaded successfully.`);
            } catch (error) {
                console.error(`Failed to download image ${i + 1}/${a.length}: ${error}`);
            }
        }
    }
    // private Download(url: string, destination: string) {
    //     request(url)
    //         .pipe(fs.createWriteStream(destination))
    //         .on('close', () => {
    //             console.log('Image downloaded successfully!');
    //         })
    //         .on('error', (err: any) => {
    //             console.error('Error downloading the image:', err);
    //         });
    // }
    private downloadImage(url:string, filename:string) {
        return new Promise((resolve, reject) => {
            request(url)
                .pipe(fs.createWriteStream(filename))
                .on('close', resolve)
                .on('error', reject);
        });
    }

}