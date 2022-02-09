const StaticWado = require('../src/index')
const assert = require('assert')
const fs = require('fs')

describe('index', async() => {
    let dicomp10stream

    const importer = new StaticWado({
        isStudyData: true,
        isGroup: true,
    });

    beforeEach(async() => {
        //dicomp10stream = fs.createReadStream('../dagcom-test-data/dicom/WG04/compsamples_refanddir/IMAGES/REF/CT1_UNC')
        dicomp10stream = fs.createReadStream('/dicom/2_skull_ct/DICOM/I10');
        //dicomp10stream = fs.createReadStream('../dagcom-test-data/dicom/encoding-variants/pixel-data/US_MF_RGB.implicit_little_endian.dcm')
    })

    it('exports', async () => {
        assert.notStrictEqual(importer, undefined)
    })

    // TODO - add integration tests
})