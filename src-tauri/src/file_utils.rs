use crate::error_utils::Error;

use std::io::Read;
use std::io::Seek;

#[tauri::command]
pub fn read_file(path: &str, offset: u64, length: usize) -> Result<String, Error> {
    // there are more checks I could do, but for now just check game-version in header
    let mut buf: Vec<u8> = vec![0; length];
    let mut f = std::fs::File::open(path)?;
    f.seek(std::io::SeekFrom::Start(offset))?;
    f.read_exact(&mut buf)?;

    // ok so the utf err handling here is mondo jank lol, but the enum/thiserror approach
    // didn't work as expected
    // tl;dr, this could probably be better 
    Ok(match std::str::from_utf8(&buf) {
        Err(_) => String::from("UTF_ERR"),
        Ok(s) => s.to_owned(),
    })
}