import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator = ({ url }: { url: string }) => {
    return (<>
        <div>
            <QRCode value={url} />
        </div>
            {url}
        </>
    );
};

export default QRCodeGenerator;
